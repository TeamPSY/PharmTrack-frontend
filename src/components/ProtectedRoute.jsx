import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");

  if (!user) {
    alert("로그인이 필요한 기능입니다.");
    return <Navigate to="/login" replace />;
  }

  return children;
}
