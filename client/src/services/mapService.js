export const getLatLng = async (placeName) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  if (data.status !== "OK") throw new Error("Geocoding failed");
  console.log(data.status);

  return data.results[0].geometry.location;
};

export const getNearbyParkings = async (lat, lng) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=parking&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  if (data.status !== "OK") throw new Error("Nearby search failed");

  return data.results;
};
