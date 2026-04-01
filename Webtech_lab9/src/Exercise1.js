import React from "react";

function Exercise1() {
  const name = "Jakkilinki Vineetha";
  const department = "Computer Science and Engineering";
  const year = "2nd Year";
  const section = "B";

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "500px", margin: "20px auto", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <h1>Student Profile</h1>
      <div>
        <h2>{name}</h2>
        <p><strong>Department:</strong> {department}</p>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Section:</strong> {section}</p>
      </div>
    </div>
  );
}

export default Exercise1;