import React from "react";

function StudentCard(props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "10px",
        width: "280px",
        display: "inline-block",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{props.name}</h3>
      <p><strong>Department:</strong> {props.department}</p>
      <p><strong>Marks:</strong> {props.marks}/100</p>
    </div>
  );
}

function Exercise2() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      <StudentCard name="Jakkilinki Vineetha" department="CSE" marks={85} />
      <StudentCard name="Ravi Kumar" department="ECE" marks={72} />
      <StudentCard name="Priya Sharma" department="IT" marks={91} />
    </div>
  );
}

export default Exercise2;