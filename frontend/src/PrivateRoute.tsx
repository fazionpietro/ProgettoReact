import React from "react";
import { Navigate, Outlet } from "react-router";

function PrivateRoute() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
}

export default PrivateRoute;