import { useState } from "react";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(""); // Store base64 string
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);

  // Handle Image Upload and Convert to Base64
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview image

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Remove "data:image/png;base64," part
        setBase64Image(base64String);
      };
    }
  };

  // Send Image to Backend in Base64 Format
  const analyzeImage = async () => {
    if (!base64Image) {
      alert("Please upload an image first!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBytes: base64Image }), // Send base64 string
      });

      const data = await response.json();
      setMood(data.mood);
      setSongs(data.songs);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  return (
    <div className="container">
      <h2>Upload an Image to Get a Song Recommendation</h2>
      <input type="file" onChange={handleImageUpload} />
      {image && <img src={image} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />}
      <button onClick={analyzeImage}>Analyze Image</button>

      {mood && (
        <div>
          <h3>Mood Detected: {mood}</h3>
          <h3>Recommended Songs:</h3>
          <ul>
            {songs.map((song, index) => (
              <li key={index}>
                <a href={song.url} target="_blank" rel="noopener noreferrer">
                  {song.name} by {song.artist}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
