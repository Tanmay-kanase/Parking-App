const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Enable CORS for frontend requests
app.use(cors());

// Load API key from .env
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Geocode API - Convert address to lat/lng
app.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      { params: { address, key: GOOGLE_API_KEY } }
    );
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch geocode data" });
  }
});

// Nearby places API - Get parking locations
app.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // Get nearby parking places with additional details
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: "parking",
          key: GOOGLE_API_KEY,
        },
      }
    );

    let places = response.data.results;

    // Fetch more details for each place
    const detailedPlaces = await Promise.all(
      places.map(async (place) => {
        const detailsResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json`,
          {
            params: {
              place_id: place.place_id,
              fields: "name,vicinity,opening_hours,rating,reviews,photos",
              key: GOOGLE_API_KEY,
            },
          }
        );
        return detailsResponse.data.result;
      })
    );

    res.json({ status: "OK", results: detailedPlaces });
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
