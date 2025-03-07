// import React, { useState } from "react";
// import "../styles/spaceTruss.css"; // Import the CSS file

// const SpaceTruss: React.FC = () => {
//   const [coordinates, setCoordinates] = useState({ x: "", y: "", z: "" });
//   const [points, setPoints] = useState<{ id: number; name: string; x: string; y: string; z: string }[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCoordinates({ ...coordinates, [e.target.name]: e.target.value });
//   };

//   const handleAddPoint = () => {
//     if (coordinates.x && coordinates.y && coordinates.z) {
//       const newNode = {
//         id: points.length + 1, // ID is for internal tracking (not used for display)
//         name: `Node.${points.length + 1}`, // Display name
//         ...coordinates,
//       };
//       setPoints([...points, newNode]);
//       setCoordinates({ x: "", y: "", z: "" }); // Reset input fields
//     }
//   };

//   const handleDeletePoint = (id: number) => {
//     const updatedPoints = points.filter((point) => point.id !== id);

//     // Renumber nodes dynamically after deletion
//     const renumberedPoints = updatedPoints.map((point, index) => ({
//       ...point,
//       id: index + 1,
//       name: `Node.${index + 1}`,
//     }));

//     setPoints(renumberedPoints);
//   };

//   return (
//     <div className="container">
//       <div className="input-box">
//         <h2 className="title">Space Truss Input</h2>
//         <div className="input-group">
//           <input
//             type="number"
//             name="x"
//             value={coordinates.x}
//             onChange={handleChange}
//             placeholder="Enter X coordinate"
//             className="input-field"
//           />
//           <input
//             type="number"
//             name="y"
//             value={coordinates.y}
//             onChange={handleChange}
//             placeholder="Enter Y coordinate"
//             className="input-field"
//           />
//           <input
//             type="number"
//             name="z"
//             value={coordinates.z}
//             onChange={handleChange}
//             placeholder="Enter Z coordinate"
//             className="input-field"
//           />
//           <button onClick={handleAddPoint} className="submit-btn">Add Point</button>
//         </div>

//         {/* Display entered points with delete option */}
//         <div className="point-list">
//           <h3 className="list-title">Entered Points:</h3>
//           <ul>
//             {points.map((point) => (
//               <li key={point.id} className="point-item">
//                 <strong>{point.name}:</strong> ({point.x}, {point.y}, {point.z})
//                 <button onClick={() => handleDeletePoint(point.id)} className="delete-btn">❌</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpaceTruss;












import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/spaceTruss.css"; // Import the CSS file

const API_URL = "http://127.0.0.1:8000/api/nodes/";

const SpaceTruss: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ x: "", y: "", z: "" });
  const [points, setPoints] = useState<{ id: number; name: string; x: string; y: string; z: string }[]>([]);

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
    if (coordinates.x && coordinates.y && coordinates.z) {
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
        </div>
      </div>
    </div>
  );
};

export default SpaceTruss;
