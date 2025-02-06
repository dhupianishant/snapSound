import React from "react";
import { useNavigate } from "react-router-dom";
import "../landingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1 className="landingPageBranding">
            &nbsp;SnapSound&nbsp;
      </h1>
      <div className="landingPageSlogan">
            See the mood, hear the music!
      </div>
      <button onClick={() => navigate("/main")} className="landingPageButton">Get Started →</button>
    </div>
  );
};

export default LandingPage;
