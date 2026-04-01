import React, { useState } from "react";
import Exercise1 from "./Exercise1";
import Exercise2 from "./Exercise2";
import Exercise3 from "./Exercise3";

function App() {
  const [activeExercise, setActiveExercise] = useState(1);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2196F3", textAlign: "center" }}>Webtech Lab - React Exercises</h1>
      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveExercise(1)}
          style={{ 
            backgroundColor: activeExercise === 1 ? "#2196F3" : "#ddd", 
            color: activeExercise === 1 ? "white" : "black",
            border: "none", padding: "10px 20px", margin: "0 5px", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Exercise 1
        </button>
        <button
          onClick={() => setActiveExercise(2)}
          style={{ 
            backgroundColor: activeExercise === 2 ? "#2196F3" : "#ddd", 
            color: activeExercise === 2 ? "white" : "black",
            border: "none", padding: "10px 20px", margin: "0 5px", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Exercise 2
        </button>
        <button
          onClick={() => setActiveExercise(3)}
          style={{ 
            backgroundColor: activeExercise === 3 ? "#2196F3" : "#ddd", 
            color: activeExercise === 3 ? "white" : "black",
            border: "none", padding: "10px 20px", margin: "0 5px", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Exercise 3
        </button>
      </div>

      {activeExercise === 1 && <Exercise1 />}
      {activeExercise === 2 && <Exercise2 />}
      {activeExercise === 3 && <Exercise3 />}
    </div>
  );
}

export default App;