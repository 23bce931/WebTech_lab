import React, { useState } from "react";

function Exercise2() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, { id: Date.now(), text: inputValue.trim() }]);
      setInputValue("");
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ maxWidth: "500px", padding: "30px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <h2>Task List</h2>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter task..."
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
        />
        <button
          onClick={addItem}
          style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p>No tasks. Add one above!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                marginBottom: "8px",
                backgroundColor: "white",
                borderRadius: "4px",
                border: "1px solid #eee"
              }}
            >
              <span>{item.text}</span>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Exercise2;