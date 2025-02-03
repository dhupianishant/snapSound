const Clarifai = require("clarifai");
require("dotenv").config();

// Initialize Clarifai with API Key
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

// Function to analyze an image
const analyzeImage = async (imageUrl) => {
  try {
    const response = await app.models.predict(
      Clarifai.GENERAL_MODEL,
      imageUrl
    );

    return response.outputs[0].data.concepts;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return null;
  }
};

module.exports = { analyzeImage };
