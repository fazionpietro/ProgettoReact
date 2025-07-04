import "./stylesheets/Table.css";
import "./stylesheets/Profile.css";
import Navbar from "./Navbar";
import Table from "./Tabelle/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface user {
    username: string;
    email: string;
    ruolo: string;
}

function Routine() {
    const [user, setUser] = useState<user>();
    
    const navigate = useNavigate();

    const getUtente = async () => {
        try {
            await axios
                .get(`${import.meta.env.VITE_API_KEY}/getDatiUtente`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        setUser(resp.data);
                        
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUtente();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="profileContainer">
                <div className="profile">
                    <h1>Benvenuto: {user?.username}</h1>
                    <h3>{user?.email}</h3>
                </div>
                <div>
                    <p>{user?.ruolo == "utente" ? "Routine" : "Pazienti"}</p>
                    <Table />
                </div>
            </div>
            ;{" "}
            {user?.ruolo == "utente" ? (
                <></>
            ) : (
                <>
                    <div className="newButtonContainer">
                        <button
                            className="newButton"
                            onClick={() => navigate("/AggiungiUtente")}
                        >
                            Nuovo Paziente
                        </button>
                    </div>
                </>
            )}
            <div className="newButtonContainer">
                <button
                    className="newButton"
                    onClick={() => navigate(`/AggiungiScheda/${user?.email}`)}
                >
                    Nuova Scheda
                </button>
            </div>
        </div>
    );
}

export default Routine;
