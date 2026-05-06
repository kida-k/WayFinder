const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getPointAlongRoute({ origin, destination, hours_into_trip }) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') return { error: `Failed to get route: ${data.status}` };
  const steps = data.routes[0].legs[0].steps;
  const targetSeconds = hours_into_trip * 3600;
  let elapsed = 0;
  let targetStep = steps[steps.length - 1];
  for (const step of steps) {
    elapsed += step.duration.value;
    if (elapsed >= targetSeconds) { targetStep = step; break; }
  }
  const { lat, lng } = targetStep.end_location;
  return { lat, lng, hours_into_trip };
}

export async function searchPlace({ query, lat, lng, radius = 5000 }) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(query)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return { error: 'No places found' };
  return data.results.slice(0, 3).map(p => ({
    id: p.place_id,
    name: p.name,
    lat: p.geometry.location.lat,
    lng: p.geometry.location.lng,
    address: p.vicinity,
    rating: p.rating || null
  }));
}

export async function searchPlaceNearCity({ query, city }) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${GOOGLE_KEY}`;
  const geocodeRes = await fetch(geocodeUrl);
  const geocodeData = await geocodeRes.json();
  if (geocodeData.status !== 'OK') return { error: `Could not find city: ${city}` };
  const { lat, lng } = geocodeData.results[0].geometry.location;
  return searchPlace({ query, lat, lng, radius: 10000 });
}

export async function getRouteOptions({ origin, destination, avoid_tolls = false, waypoints = [] }) {
  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_KEY}`;
  if (avoid_tolls) url += '&avoid=tolls';
  if (waypoints.length > 0) url += `&waypoints=${waypoints.map(w => encodeURIComponent(w)).join('|')}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') return { error: `Route failed: ${data.status}` };
  const leg = data.routes[0].legs[0];
  return {
    distance: leg.distance.text,
    duration: leg.duration.text,
    avoid_tolls,
    summary: data.routes[0].summary
  };
}