import axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";

function PrivateRoute() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");



  useEffect(() => {
    console.log(token);
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/checkAuth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.log("Errore validazione token:");
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) {
 
    return <div>Caricamento...</div>;
  }
  
  if (!isValid) {

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
