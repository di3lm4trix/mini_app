import { useState, useEffect } from "react";
import { apiClient } from "../api/client";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // to controle the status, cheking, ok, invalid
  const [status, setStatus] = useState("cheking");

  useEffect(() => {
    // if not token, dont use the fetch
    if (!token) {
      setStatus("invalid");
      return;
    }

    apiClient
      .get("/api/auth/verify")
      .then(() => setStatus("ok"))
      .catch(() => {
        // the backend return 401, token expired or manipuled
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStatus("invalid");
      });
  }, [token]);
  if (status === "cheking") return null;
  if (status === "invalid") return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
