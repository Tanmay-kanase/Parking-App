export const getLatLng = async (placeName) => {
  
  const backendProxy = "http://localhost:8080"; 

  const response = await fetch(`${backendProxy}/geocode?address=${placeName}`);
  const data = await response.json();
  console.log(data);

  if (data.status !== "OK") throw new Error("Geocoding failed");

  return data.results[0].geometry.location;
};

export const getNearbyParkings = async (lat, lng) => {
  const backendProxy = "http://localhost:8080"; 

  const response = await fetch(`${backendProxy}/nearby?lat=${lat}&lng=${lng}`);
  const data = await response.json();
  console.log(data);

  if (data.status !== "OK") throw new Error("Nearby search failed");

  return data.results;
};
