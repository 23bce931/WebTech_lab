import React, { useState, useEffect } from "react";

function Exercise3() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();

        setData(users.slice(0, 5));
      } catch (err) {
        setError("Failed to fetch users: " + err.message);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "300px",
        flexDirection: "column"
      }}>
        <div style={{ fontSize: "24px", color: "#666", marginBottom: "20px" }}>
          🔄 Loading users from API...
        </div>
        <div style={{ fontSize: "14px", color: "#999" }}>Please wait</div>
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "300px",
        flexDirection: "column",
        textAlign: "center",
        color: "#f44336"
      }}>
        <div style={{ fontSize: "20px", marginBottom: "10px" }}>
          ❌ {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // ✅ Success UI
  return (
    <div style={{ 
      maxWidth: "700px", 
      padding: "30px", 
      border: "2px solid #2196F3", 
      borderRadius: "12px", 
      backgroundColor: "#f8f9ff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#2196F3", marginBottom: "25px" }}>
        👥 Users from External API
      </h2>
      
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "8px", 
        overflow: "hidden", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
      }}>
        {data.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "20px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
                {user.name}
              </h3>
              <p style={{ margin: "0", color: "#555" }}>
                📧 {user.email}
              </p>
              <p style={{ margin: "0", color: "#777" }}>
                🌐 {user.website}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0", fontWeight: "bold", color: "#2196F3" }}>
                @{user.username}
              </p>
              <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
                {user.company.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exercise3;