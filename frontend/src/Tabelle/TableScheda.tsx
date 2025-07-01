import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "../stylesheets/Table.css";
import Navbar from "../Navbar";

interface exercise{
    esercizio_id: number;
    id : number;
    nome_scheda: string;
    note: string;
    ripetizioni: number;
    scheda_id: number;
    serie: number;

}

interface nomeEsercizio {
    nome: string;
}

interface user {
    username: string;
    email: string;
    role: string;
}

const TableScheda: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const schedaId = id ? parseInt(id, 10) : null;
    
    const [email, setEmail] = useState()

    const navigate = useNavigate();
    const [ex, setEx] = useState<exercise[]>([]);
    const [user, setUser] = useState<user>();
    const [ne, setNE] = useState<nomeEsercizio[]>([]);

    //inserisci getdatiutente()
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
                        setEmail(resp.data.email)
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const getNomeEsercizio = async () => {
        try {
            await axios
                .get(`${import.meta.env.VITE_API_KEY}/getNomeEsercizio`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNE(resp.data.data);
                        console.log(resp.data.data);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteExSCheda = async (id: number, esercizio_id: number) => {
        try {
            await axios
                .delete(
                    `${
                        import.meta.env.VITE_API_KEY
                    }/deleteExScheda/${id}/${esercizio_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                            )}`,
                        },
                    }
                )
                .then((resp) => {
                    if (resp.status === 200) {
                        console.log("eliminato");
                        setEx((prev) => prev.filter((e) => e.id !== id));
                        getEsercizi();
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const getEsercizi = async () => {
        const mail = user?.email;
        if (!mail) {
            console.error("email assente");
            return;
        }

        try {
            await axios
                .get(
                    `${
                        import.meta.env.VITE_API_KEY
                    }/schedeEserciziUtente?email=${mail}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                            )}`,
                        },
                    }
                )
                .then((resp) => {
                    if (resp.status === 200) {
                        setEx(resp.data.data);
                        console.log(resp.data.data);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUtente();
        getNomeEsercizio();
    }, []);

    useEffect(() => {
        if (user) {
            getEsercizi();
        }
    }, [user]);

    const handleClick = (id: number, esercizio_id: number) => {
        deleteExSCheda(id, esercizio_id);
    };

    return (
        <div>
            <Navbar/>
            <div className="tableContainer">
                 <h2>Esercizi scheda</h2>
                <table>
                    <thead>
                        <tr>
                            <th>schedaId</th>
                            <th>esercizioId</th>
                            <th>serie</th>
                            <th>ripetizioni</th>
                            <th>elimina esercizio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ex
                            .filter((e) => e.scheda_id === schedaId)
                            .map((e, i) => (
                                <tr key={e.id}>
                                    <td>{e.scheda_id}</td>
                                    <td>{ne[i]?.nome}</td>
                                    <td>{e.serie}</td>
                                    <td>{e.ripetizioni}</td>
                                    <td>
                                        <button
                                        className="delButton"
                                            onClick={() =>
                                                handleClick(
                                                    e.id,
                                                    e.esercizio_id
                                                )
                                            }
                                        >
                                            elimina
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="newButtonContainer">
                <button
                    className="newButton"
                    onClick={() => navigate(`/AggiungiAScheda/${id}/${email}`)}
                >
                    Aggiorna Scheda
                </button>
                
            </div>
            <div className="navLink">
                    <a  onClick={()=> navigate(-1)}>Indietro</a>
            </div>
        </div>
    );
};

export default TableScheda;
