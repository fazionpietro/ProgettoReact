import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

function PrivateRoute() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();


  useEffect(() => {

    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_KEY}/checkAuth`, {
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
        navigate("/login")
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