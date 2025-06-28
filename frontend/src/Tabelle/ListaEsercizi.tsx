import axios from "axios";
import { useEffect, useState } from "react";
import "../stylesheets/Table.css";
import esercizioData from "../types/esercizioType";

const ListaEsercizi = () => {
    const [esercizi, setEsercizi] = useState<esercizioData[]>([]);
  

    const getEsercizi = async () => {
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
                        setEsercizi(resp.data);
                        
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    async function delEsercizio(id: number) {
        try {
            const resp = await axios.delete(
                `${import.meta.env.VITE_API_KEY}/deleteEsercizio/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (resp.status === 200) {
               getEsercizi()
            }
        } catch (error) {
            console.error("errore", error);
        }
    }

    useEffect(() => {
        getEsercizi();
    }, []);

    const handleClick = (id: number) => {
        delEsercizio(id);
        
        
    };

    return (
        <div>
            
            <div className="tableContainer">
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>nome</th>
                            <th>descrizione</th>
                            <th>muscolo</th>
                            <th>difficolta</th>
                            <th>elimina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {esercizi.map((e) => (
                            <tr key={e.id}>
                                <td>{e.id}</td>
                                <td>{e.nome}</td>
                                <td>{e.descrizione}</td>
                                <td>{e.muscolo_targhet}</td>
                                <td>{e.difficolta}</td>
                                <td>
                                    <button
                                        className="delButton"
                                        onClick={() => {
                                            handleClick(e.id);
                                            
                                        }}
                                    >
                                        elimina
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default ListaEsercizi;
