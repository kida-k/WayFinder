import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import suggestRoute from "./routes/suggest.js";

dotenv.config();

const app = express();
const PORT = 3001;
const TRIPS_FILE = "./trips.json";

app.use(cors());
app.use(express.json());

// --- FILE STORAGE HELPERS ---

const loadTripsFromFile = () => {
  try {
    if (!fs.existsSync(TRIPS_FILE)) return [];
    const data = fs.readFileSync(TRIPS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading trips file:", err);
    return [];
  }
};

const saveTripsToFile = (trips) => {
  try {
    fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2));
  } catch (err) {
    console.error("Error writing to trips file:", err);
  }
};

// --- BASIC ENDPOINTS ---

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", suggestRoute);

// --- SAVED TRIPS LOGIC (PERSISTENT) ---

app.post("/api/trips", (req, res) => {
  const { tripName, stops } = req.body;
  if (!tripName || !stops || !Array.isArray(stops)) {
    return res.status(400).json({ error: "Trip name and stops array are required" });
  }
  const trips = loadTripsFromFile();
  const newTrip = {
    id: Date.now().toString(),
    tripName,
    stops,
    createdAt: new Date().toISOString(),
  };
  trips.push(newTrip);
  saveTripsToFile(trips);
  console.log(`Trip Persisted: ${tripName} (${stops.length} stops)`);
  res.status(201).json(newTrip);
});

app.get("/api/trips", (req, res) => {
  const trips = loadTripsFromFile();
  res.json(trips);
});

app.delete("/api/trips/:id", (req, res) => {
  const { id } = req.params;
  try {
    let trips = loadTripsFromFile();
    const initialLength = trips.length;
    trips = trips.filter(trip => trip.id !== id);
    if (trips.length === initialLength) {
      return res.status(404).json({ error: "Trip not found" });
    }
    saveTripsToFile(trips);
    console.log(`Trip deleted: ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

// --- EXPLORE ENDPOINT ---

app.post("/api/explore", async (req, res) => {
  const { city, query } = req.body;
  if (!city || !query) {
    return res.status(400).json({ error: "city and query are required" });
  }
  try {
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.status !== "OK") {
      return res.status(400).json({ error: "Could not find that city" });
    }
    const { lat, lng } = geoData.results[0].geometry.location;
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=${encodeURIComponent(query)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();
    const results = (placesData.results || []).slice(0, 10).map(p => ({
      name: p.name,
      address: p.vicinity,
      rating: p.rating || null,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
    }));
    res.json({ results });
  } catch (err) {
    console.error("Explore error:", err);
    res.status(500).json({ error: "Failed to search places" });
  }
});

// --- CUSTOM CHAT & MCP LOGIC ---

app.post("/api/chat", async (req, res) => {
  try {
    const { message, currentStops } = req.body;

    // 1. AI Intent Extraction with fallback models
    const models = [
      "openrouter/free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "qwen/qwen-2.5-7b-instruct:free",
      "google/gemini-2.0-flash-exp:free",
    ];

    let aiData = null;
    for (const model of models) {
      const aiResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content: `You are a strict data extraction tool. Your ONLY job is to turn user requests into JSON.
            
            RULES:
            1. "searchTerm" is the specific place type (e.g., "state park", "pizza").
            2. "afterStop" is the location/city mentioned (e.g., "Denver"). If none, use null.
            3. Do NOT invent locations. Use ONLY what the user provides.

            EXAMPLES:
            User: "Find a park near Denver" 
            JSON: {"searchTerm": "park", "afterStop": "Denver", "hoursAfter": null}`,
              },
              { role: "user", content: message },
            ],
          }),
        }
      );
      aiData = await aiResponse.json();
      if (aiData.choices?.[0]?.message?.content) break;
      console.log(`Model ${model} failed, trying next...`);
    }

    if (!aiData?.choices?.[0]?.message?.content) {
      console.log("All models failed:", JSON.stringify(aiData, null, 2));
      throw new Error("AI failed to return valid content");
    }

    let rawContent = aiData.choices[0].message.content;
    const cleanJson = rawContent.replace(/```json|```/g, "").trim();
    let intent = JSON.parse(cleanJson);

    console.log("-----------------------------------------");
    console.log("Extracted Intent:", intent);

    // 2. Reference Stop Logic (Fuzzy Match -> Geocode -> Fallback)
    let referenceStop = null;

    if (intent.afterStop) {
      const searchKey = intent.afterStop.toLowerCase().trim();
      referenceStop = currentStops.find(s =>
        s.name?.toLowerCase().includes(searchKey) || searchKey.includes(s.name?.toLowerCase())
      );
    }

    if (!referenceStop && intent.afterStop) {
      console.log(`"${intent.afterStop}" not in route. Geocoding...`);
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(intent.afterStop)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      if (geoData.results?.length > 0) {
        const loc = geoData.results[0].geometry.location;
        referenceStop = {
          lat: loc.lat,
          lng: loc.lng,
          name: geoData.results[0].formatted_address
        };
      }
    }

    if (!referenceStop) {
      referenceStop = currentStops[currentStops.length - 1] || { lat: 32.9857, lng: -96.7501, name: "UT Dallas" };
    }

    console.log(`Searching near: ${referenceStop.name}`);

    // 3. Google Places Search
    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${referenceStop.lat},${referenceStop.lng}&radius=50000&keyword=${encodeURIComponent(intent.searchTerm)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const googleRes = await fetch(googleUrl);
    const googleData = await googleRes.json();

    if (googleData.results && googleData.results.length > 0) {
      const realPlace = googleData.results[0];
      const newStop = {
        name: realPlace.name,
        description: `Found near ${referenceStop.name}. Rated ${realPlace.rating || "N/A"} stars.`,
        lat: realPlace.geometry.location.lat,
        lng: realPlace.geometry.location.lng,
        address: realPlace.vicinity,
      };
      console.log("Found real location:", newStop.name);
      res.json({ newStop });
    } else {
      res.status(404).json({ error: `No results for "${intent.searchTerm}" near ${referenceStop.name}.` });
    }

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Wayfinder server is live!`);
  console.log(`Local IP: http://192.168.5.2:${PORT}`);
});