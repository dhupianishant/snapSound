require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing

// Analyze image and get mood
app.post("/analyze-image", async (req, res) => {
  try {
    const { imageBytes } = req.body;
    if (!imageBytes) {
      return res.status(400).json({ error: "Image data is required" });
    }

    // Send base64 image to Clarifai
    const clarifaiResponse = await axios.post(
      "https://api.clarifai.com/v2/models/" + process.env.CLARIFAI_MODEL_ID + "/outputs",
      {
        inputs: [{ data: { image: { base64: imageBytes } } }],
      },
      {
        headers: { Authorization: `Key ${process.env.CLARIFAI_API_KEY}` },
      }
    );

    const detectedMood = clarifaiResponse.data.outputs[0].data.concepts[0].name;
    console.log(`Detected Mood: ${detectedMood}`);

    // Fetch songs from Spotify based on mood
    const songs = await getSpotifySong(detectedMood);

    res.json({ mood: detectedMood, songs });
  } catch (error) {
    console.error("Error analyzing image:", error.response?.data || error.message);
    res.status(500).json({ error: "Error analyzing image" });
  }
});

// Function to get Spotify Access Token
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
    console.error("Error fetching Spotify access token:", error.response?.data || error.message);
    throw new Error("Failed to get Spotify access token");
  }
}

// Function to get songs from Spotify based on mood
async function getSpotifySong(mood) {
  try {
    const token = await getSpotifyAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=track&limit=5`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists[0].name,
      url: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error("Error fetching songs from Spotify:", error.response?.data || error.message);
    return [];
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
