const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increased JSON size limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // URL-encoded data

// Root route for testing the server
app.get("/", (req, res) => {
  res.send("Welcome to the SnapSound API! Server is running.");
});

// Function to get Spotify Access Token using Client Credentials Flow
async function getSpotifyAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error.message);
    throw new Error("Failed to get Spotify access token");
  }
}

// Function to search for songs based on mood
async function getSongsBasedOnMood(mood) {
  try {
    const token = await getSpotifyAccessToken();
    let searchQuery = mood || "pop"; // Default to "pop" if mood is unknown

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists[0].name,
      url: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error("Error fetching songs from Spotify:", error.message);
    return []; // Return empty array to avoid breaking the app
  }
}

// POST route to analyze image and recommend songs based on mood
app.post("/analyze-image", async (req, res) => {
  const { imageBytes } = req.body; // Expect base64 image string

  if (!imageBytes) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    // Send base64 image to Clarifai API for mood analysis
    const clarifaiResponse = await axios.post(
      "https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs",
      {
        inputs: [{ data: { image: { base64: imageBytes } } }],
      },
      {
        headers: { Authorization: `Key ${process.env.CLARIFAI_API_KEY}` },
      }
    );

    const detectedMood =
      clarifaiResponse.data.outputs[0]?.data?.concepts?.[0]?.name || "unknown";

    // Get songs based on detected mood
    const songs = await getSongsBasedOnMood(detectedMood);

    res.json({ mood: detectedMood, songs });
  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
