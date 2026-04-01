import React, { useState } from "react";
import Exercise1 from "./Exercise1";
import Exercise2 from "./Exercise2";
import Exercise3 from "./Exercise3";

function App() {
  const [activeExercise, setActiveExercise] = useState(1);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2196F3", textAlign: "center" }}>Lab 10: React JS</h1>
      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveExercise(1)}
          style={{ 
            backgroundColor: activeExercise === 1 ? "#2196F3" : "#ddd", 
            color: activeExercise === 1 ? "white" : "black",
            border: "none", padding: "12px 24px", margin: "0 8px", borderRadius: "6px", cursor: "pointer", fontSize: "16px"
          }}
        >
          Exercise 1: Form
        </button>
        <button
          onClick={() => setActiveExercise(2)}
          style={{ 
            backgroundColor: activeExercise === 2 ? "#2196F3" : "#ddd", 
            color: activeExercise === 2 ? "white" : "black",
            border: "none", padding: "12px 24px", margin: "0 8px", borderRadius: "6px", cursor: "pointer", fontSize: "16px"
          }}
        >
          Exercise 2: List
        </button>
        <button
          onClick={() => setActiveExercise(3)}
          style={{ 
            backgroundColor: activeExercise === 3 ? "#2196F3" : "#ddd", 
            color: activeExercise === 3 ? "white" : "black",
            border: "none", padding: "12px 24px", margin: "0 8px", borderRadius: "6px", cursor: "pointer", fontSize: "16px"
          }}
        >
          Exercise 3: API
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {activeExercise === 1 && <Exercise1 />}
        {activeExercise === 2 && <Exercise2 />}
        {activeExercise === 3 && <Exercise3 />}
      </div>
    </div>
  );
}

export default App;