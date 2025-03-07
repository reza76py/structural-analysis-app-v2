import React, { useState } from "react";
import "../styles/spaceTruss.css"; // Import the CSS file

const SpaceTruss: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ x: "", y: "", z: "" });
  const [points, setPoints] = useState<{ x: string; y: string; z: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates({ ...coordinates, [e.target.name]: e.target.value });
  };

  const handleAddPoint = () => {
    if (coordinates.x && coordinates.y && coordinates.z) {
      setPoints([...points, coordinates]);
      setCoordinates({ x: "", y: "", z: "" }); // Reset input fields
    }
  };

  return (
    <div className="container">
      <div className="input-box">
        <h2 className="title">Space Truss Input</h2>
        <div className="input-group">
          <input
            type="number"
            name="x"
            value={coordinates.x}
            onChange={handleChange}
            placeholder="Enter X coordinate"
            className="input-field"
          />
          <input
            type="number"
            name="y"
            value={coordinates.y}
            onChange={handleChange}
            placeholder="Enter Y coordinate"
            className="input-field"
          />
          <input
            type="number"
            name="z"
            value={coordinates.z}
            onChange={handleChange}
            placeholder="Enter Z coordinate"
            className="input-field"
          />
          <button onClick={handleAddPoint} className="submit-btn">Add Point</button>
        </div>

        {/* Display entered points */}
        <div className="point-list">
          <h3 className="list-title">Entered Points:</h3>
          <ul>
            {points.map((point, index) => (
              <li key={index} className="point-item">
                ({point.x}, {point.y}, {point.z})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpaceTruss;
