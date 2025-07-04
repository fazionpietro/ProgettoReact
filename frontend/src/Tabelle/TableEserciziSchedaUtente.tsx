import React, { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router";
import axios from "axios";
import "../stylesheets/Table.css";
import Navbar from "../Navbar";
import esercizioData from "../types/esercizioType";



interface exercise {
    id: number;
    scheda_id: number;
    esercizio_id: number;
    serie: number;
    ripetizioni: number;
}

const TableSchedaDoc: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const schedaId = id ? parseInt(id, 10) : null;
    const { email } = useParams<{ email: string }>();
    

    const [ex, setEx] = useState<exercise[]>([]);
    const [ne, setNE] = useState<esercizioData[]>([]);



    const getNomeEsercizio = async () => {
        try {
            await axios
                .get(`${import.meta.env.VITE_API_KEY}/esercizi`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNE(resp.data);
                        console.log(resp.data);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteExSCheda = async (id: number) => {
        try {
            await axios
                .delete(
                    `${
                        import.meta.env.VITE_API_KEY
                    }/deleteExSCheda/${id}`,
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

    const handleClick = (id: number) => {
        deleteExSCheda(id);
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
                            .map((e) => {
                                const nomeEsercizio = ne.find((el) => el.id === e.esercizio_id)?.nome || 'Nome non trovato';
                                return(
                                <tr key={e.id}>
                                    
                                    
                                    <td>{nomeEsercizio}</td>
                                    <td>{e.serie}</td>
                                    <td>{e.ripetizioni}</td>
                                    <td>
                                        <button className="delButton"
                                            onClick={() =>
                                                handleClick(e.id)
                                            }
                                        >
                                            elimina
                                        </button>
                                    </td>
                                </tr>
                            )})}
                    </tbody>
                </table>
            </div>
            <div className="newButtonContainer">
                <button className="newButton" onClick={()=> navigate(`/AggiungiAScheda/${id}/${email}`)}>Aggiungi Esercizi</button>
            </div>
            <div className="navLink">
                <a  onClick={()=> navigate(-1)}>Indietro</a>
            </div>
        </div>
    );
}; 

export default TableSchedaDoc;