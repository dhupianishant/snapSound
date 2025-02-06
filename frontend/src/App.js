import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./components/LandingPage";
import ImageUploader from "./components/ImageUploader";
import PredictionResults from "./components/PredictionResults"; 
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);

  return (
    <Router>
      <Routes>
        
        {/* Lanidng Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Image Uploader and Results */}
        <Route path="/main" element={
            <>
                  {/* <Navbar /> */}
                  <div className="navbar">
                        <h1 className="navbarHeading">
                              SnapSound
                        </h1>

                        <div className="nav-icons">
                              <a className="navIcons" href="https://github.com/dhupianishant" target="_blank" rel="noopener noreferrer">     
                                    <FaGithub />
                              </a>
                        
                              <a className="navIcons" href="https://www.linkedin.com/in/dhupianishant/" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedinIn />
                              </a>
                        
                              <a className="navIcons" href="https://dhupianishant.vercel.app/" target="_blank" rel="noopener noreferrer">
                                    <CgWebsite />
                              </a>
                        </div>
                  </div>
              
                  <div className="main-content">
                        <div className="left-panel">
                              <ImageUploader setSongs={setSongs} />
                        </div>

                        <div className="right-panel">
                              <PredictionResults songs={songs} />
                        </div>
                  </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
