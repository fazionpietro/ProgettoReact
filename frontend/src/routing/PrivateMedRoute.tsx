import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router"; 






function PrivateMedRoute() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");
  const [isAuthorized, setIsAuthorized] = useState(false);
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

        if (response.status === 200 ) {
         
            setIsValid(true);
            if(response.data.ruolo == "medico" || response.data.ruolo == "personalTrainer"){
              setIsAuthorized(true);
            }

        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.log("Errore validazione token:");
        navigate("/login");
        setIsValid(false);
      }
    };

    validateToken();
  }, []); 

  if (isValid === null) {
    return <div>Caricamento...</div>;
  } 

  if (!isValid && !isAuthorized) {
    return <Navigate to="/login" replace />;
  }else if (isValid && !isAuthorized){
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
}

export default PrivateMedRoute;