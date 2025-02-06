import { useState } from "react";
import "./ImageUploader.css";

const ImageUploader = ({ setSongs }) => { // Receive setSongs as a prop
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Image(reader.result.split(",")[1]);
      };
    }
  };

  const analyzeImage = async () => {
    if (!base64Image) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://snapsound.onrender.com/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBytes: base64Image }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setSongs(data.songs); // Update songs in App.js
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="image-uploader">
      <h2 className="title">Upload an Image</h2>

      <div className="upload-box">
        <input className="inputButton" type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="Uploaded preview" className="preview" />}
      </div>

      <button className="analyze-btn" onClick={analyzeImage} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>
    </div>
  );
};

export default ImageUploader;
