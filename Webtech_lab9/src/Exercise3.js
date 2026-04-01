import React, { useState } from "react";

function Exercise3() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      margin: "20px 0" 
    }}>
      <div
        style={{
          border: "2px solid #4CAF50",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
          maxWidth: "400px",
          backgroundColor: "#f0f8f0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Counter System</h2>
        <div style={{ fontSize: "48px", fontWeight: "bold", color: "#333" }}>
          {count}
        </div>
        <div style={{ margin: "20px 0" }}>
          <button
            onClick={increment}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "12px 24px",
              fontSize: "18px",
              borderRadius: "6px",
              cursor: "pointer",
              margin: "0 10px",
            }}
          >
            +
          </button>
          <button
            onClick={decrement}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "12px 24px",
              fontSize: "18px",
              borderRadius: "6px",
              cursor: "pointer",
              margin: "0 10px",
            }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}

export default Exercise3;