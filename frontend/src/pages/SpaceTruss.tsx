import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/spaceTruss.css"; // Import the CSS file

const API_URL = "http://127.0.0.1:8000/api/nodes/";

const SpaceTruss: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ x: "", y: "", z: "" });
  const [points, setPoints] = useState<{ id: number; name: string; x: string; y: string; z: string }[]>([]);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [elements, setElements] = useState<{ start: string; end: string }[]>([]);
  const [usedConnections, setUsedConnections] = useState<{ [key: string]: string[] }>({});



  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await axios.get(API_URL);
      setPoints(response.data);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinates({ ...coordinates, [e.target.name]: e.target.value });
  };

  const handleAddPoint = async () => {
    if (coordinates.x !== "" && coordinates.y !== "" && coordinates.z !== "")
      {
      const newNode = {
        name: `Node.${points.length + 1}`,
        x: coordinates.x,
        y: coordinates.y,
        z: coordinates.z,
      };

      try {
        const response = await axios.post(API_URL, newNode);
        setPoints([...points, response.data]); // Add new node to the list
        setCoordinates({ x: "", y: "", z: "" }); // Reset input fields
      } catch (error) {
        console.error("Error saving node:", error);
      }
    }
  };

  const handleDeletePoint = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`); // Ensure correct URL format
      const updatedPoints = points.filter((point) => point.id !== id);
      
      // **Important**: Do NOT renumber database IDs; keep them unique
      setPoints(updatedPoints);
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const handleRestartPoints = async () => {
    try {
      await axios.delete(`${API_URL}reset/`); // Correct API call (Django backend required)
      setPoints([]); // Clear only if the request succeeds
    } catch (error) {
      console.error("Error deleting all nodes:", error);
    }
  };

  const handleCreateElement = () => {
    if (!startNode || !endNode) {
      alert("Please select both Start and End Nodes.");
      return;
    }
    if (startNode === endNode) {
      alert("Start and End Nodes must be different.");
      return;
    }
  
    // Check if this element or its reverse already exists
    const elementExists = elements.some(
      (element) =>
        (element.start === startNode && element.end === endNode) ||
        (element.start === endNode && element.end === startNode)
    );
  
    if (elementExists) {
      alert("This element already exists.");
      return;
    }
  
    // Update used connections
    setUsedConnections((prev) => ({
      ...prev,
      [startNode]: [...(prev[startNode] || []), endNode],
    }));
  
    // Add new element
    setElements([...elements, { start: startNode, end: endNode }]);
    setStartNode("");
    setEndNode("");
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

        {/* Display entered points with delete option */}
        <div className="point-list">
          <h3 className="list-title">Entered Points:</h3>
          <ul>
            {points.map((point) => (
              <li key={point.id} className="point-item">
                <strong>{point.name}:</strong> ({point.x}, {point.y}, {point.z})
                <button onClick={() => handleDeletePoint(point.id)} className="delete-btn">❌</button>
              </li>
            ))}
          </ul>
          <button onClick={handleRestartPoints} className="restart-btn">Restart Nodes</button>
        </div>
      </div>

      <div className="element-box">
        <h2 className="title">Space Truss Elements</h2>

        {/* Start Node Dropdown */}
        <h3 className="list-title">Select Start Node:</h3>
        <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className="input-field">
          <option value=""></option>
          {points.map((point) => (
            <option key={point.id} value={point.name}>
              {point.name}
            </option>
          ))}
        </select>

        {/* End Node Dropdown */}
        <h3 className="list-title">Select End Node:</h3>
        <select value={endNode} onChange={(e) => setEndNode(e.target.value)} className="input-field">
          <option value=""></option> 
          {points
            .filter(
              (point) =>
                point.name !== startNode && // Prevent selecting the same node
                !(usedConnections[startNode] || []).includes(point.name) // Exclude previously connected nodes for this startNode only
            )
            .map((point) => (
              <option key={point.id} value={point.name}>
                {point.name}
              </option>
            ))}
        </select>
        {/* Button to Create an Element */}
        <button onClick={handleCreateElement} className="submit-btn">
          Create Element
        </button>

        {/* Display Created Elements */}
        <div className="element-list">
          <h3 className="list-title">Created Elements:</h3>
          <ul>
            {elements.map((element, index) => (
              <li key={index} className="point-item">
                {element.start} → {element.end}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpaceTruss;
