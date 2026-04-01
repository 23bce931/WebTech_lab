import React, { useState } from "react";

function Exercise1() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be 6+ characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!\n" + JSON.stringify(formData, null, 2));
      setFormData({ name: "", email: "", password: "" });
      setErrors({});
    }
  };

  return (
    <div style={{ maxWidth: "400px", padding: "30px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: errors.name ? "2px solid red" : "1px solid #ccc" }}
          />
          {errors.name && <p style={{ color: "red", fontSize: "14px" }}>{errors.name}</p>}
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: errors.email ? "2px solid red" : "1px solid #ccc" }}
          />
          {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: errors.password ? "2px solid red" : "1px solid #ccc" }}
          />
          {errors.password && <p style={{ color: "red", fontSize: "14px" }}>{errors.password}</p>}
        </div>
        
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Exercise1;
