import express from 'express';
import 'dotenv/config';

const router = express.Router();

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function geocode(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error(`Geocode failed for ${address}: ${data.status}`);
  const { lat, lng } = data.results[0].geometry.location;
  const name = data.results[0].formatted_address;
  return { name, lat, lng };
}

async function searchPlacesAlongRoute(lat, lng, type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=${type}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const place = data.results[0];
  return {
    id: place.place_id,
    name: place.name || "Interesting Spot",
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    address: place.vicinity || "Along the route",
    rating: place.rating || null,
    type: type
  };
}

async function getRouteWaypoints(origin, destination) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error(`Directions failed: ${data.status}`);

  const leg = data.routes[0].legs[0];
  const totalDistance = leg.distance.text;
  const totalDuration = leg.duration.text;

  const steps = leg.steps;
  const interval = Math.floor(steps.length / 4);
  const sampledPoints = [1, 2, 3].map(i => {
    const idx = Math.min(i * interval, steps.length - 1);
    return steps[idx].end_location;
  });

  return { sampledPoints, totalDistance, totalDuration };
}

async function addDescriptions(stops, origin, destination) {
  if (!stops || stops.length === 0) return [];

  const stopList = stops.map(s => s.name).join(', ');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{
          role: 'user',
          content: `You are a travel writer. For a road trip from ${origin} to ${destination}, write a short description (max 15 words) for each of these real stops: ${stopList}. Return ONLY a raw JSON array: [{ "name": "exact stop name", "description": "short description" }]`
        }]
      })
    });

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json|```/g, '').trim();
    const descriptions = JSON.parse(cleaned);

    return stops.map(stop => {
      const match = Array.isArray(descriptions) ? descriptions.find(d => d && d.name === stop.name) : null;
      return {
        ...stop,
        description: match ? match.description : `A great stop near ${stop.name}.`
      };
    });

  } catch (error) {
    return stops.map(stop => ({
      ...stop,
      description: "A convenient stop located along your route."
    }));
  }
}

router.post('/suggest-route', async (req, res) => {
  const { origin, destination, date } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  try {
    const [originData, destinationData] = await Promise.all([
      geocode(origin),
      geocode(destination)
    ]);

    const routeInfo = await getRouteWaypoints(origin, destination);
    const types = ['restaurant', 'tourist_attraction', 'gas_station'];
    
    const stopPromises = routeInfo.sampledPoints.map((point, i) =>
      searchPlacesAlongRoute(point.lat, point.lng, types[i % types.length])
    );
    
    const rawStops = await Promise.all(stopPromises);
    const validStops = rawStops.filter(s => s !== null);

    const finalStops = await addDescriptions(validStops, origin, destination);

    res.json({
      origin: originData,
      destination: destinationData,
      stops: finalStops,
      totalDistance: routeInfo.totalDistance,
      estimatedDuration: routeInfo.totalDuration,
      date: date
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;