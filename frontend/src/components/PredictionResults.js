import React from "react";
import "../App.css";

const PredictionResults = ({ songs }) => {
  return (
    <div className="prediction-results">
      <h2>Recommended Songs</h2>
      {songs.length > 0 ? (
        <ul className="listItems">
          {songs.map((song, index) => (
            <li key={index}>
              <a className="listItems" href={song.url} target="_blank" rel="noopener noreferrer">
                  {song.name} by {song.artist} 
                  <svg className="openLinkIcon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                        <path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
                  </svg>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results yet.</p>
      )}
    </div>
  );
};

export default PredictionResults;
