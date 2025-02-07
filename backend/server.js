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

    // Get nearby places (parking)
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

    // Extract place_ids and fetch details for each place
    const placesDetailsPromises = response.data.results.map(async (place) => {
      const detailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: place.place_id,
            key: GOOGLE_API_KEY,
          },
        }
      );

      // Extract required details
      const details = detailsResponse.data.result;
      return {
        name: place.name,
        vicinity: place.vicinity,
        photos: details.photos || [],
        opening_hours: details.opening_hours || {},
        author_name: details.user_ratings_total || 0,
        rating: details.rating || "No rating",
        website: details.website || "No website",
      };
    });

    // Wait for all place details to be fetched
    const placesDetails = await Promise.all(placesDetailsPromises);

    // Send the enriched data as response
    res.json(placesDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby places" });
  }
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
