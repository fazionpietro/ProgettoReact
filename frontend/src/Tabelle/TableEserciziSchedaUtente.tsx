import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import axios from "axios";
import "../stylesheets/Table.css";
import Navbar from "../Navbar";

interface exercise {
    id: number;
    scheda_id: number;
    esercizio_id: number;
    serie: number;
    ripetizioni: number;
}

interface nomeEsercizio {
    nome: string;
}

const TableSchedaDoc: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const schedaId = id ? parseInt(id, 10) : null;
    const { email } = useParams<{ email: string }>();
    console.log("altra pagina: ", id);

    const [ex, setEx] = useState<exercise[]>([]);
    const [ne, setNE] = useState<nomeEsercizio[]>([]);

    //inserisci getdatiutente()

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
                    }/deleteExSCheda/${id}/${esercizio_id}`,
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
        if (!email) {
            console.error("email assente");
            return;
        }

        try {
            await axios
                .get(
                    `${
                        import.meta.env.VITE_API_KEY
                    }/schedeEserciziUtente?email=${email}`,
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
        getNomeEsercizio();
    }, []);

    useEffect(() => {
        if (email) {
            getEsercizi();
        }
    }, [email]);

    const handleClick = (id: number, esercizio_id: number) => {
        deleteExSCheda(id, esercizio_id);
    };

    return (
        <div >
            <Navbar />
            <div className='tableContainer'>
                 <h2>Esercizi scheda</h2>
                <table>
                    <thead>
                        <tr>
                            
                            <th>nome esercizio</th>
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
                                    
                                    <td>{ne[i]?.nome}</td>
                                    <td>{e.serie}</td>
                                    <td>{e.ripetizioni}</td>
                                    <td>
                                        <button className="delButton"
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
                <button className="newButton" onClick={()=> navigate(`/addAScheda/${id}/${email}`)}>Aggiungi Esercizi</button>
            </div>
            <div className="navLink">
                <NavLink to="/Pazienti">Indietro</NavLink>
            </div>
        </div>
    );
};

export default TableSchedaDoc;
