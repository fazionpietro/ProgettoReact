import axios from 'axios';
import { useEffect, useState } from 'react';

interface esercizio {
    id: number;
    nome : string;
    descrizione: string;
    muscolo_targhet: string;
    difficolta : string;
}

const ListaEsercizi = () =>{

    const [exe, setEx] = useState<esercizio[]>([]);

    const getesercizi = async () => {
    try {
        await axios.get(`${import.meta.env.VITE_API_KEY}/esercizi`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                )}`,
            },
        })
        .then((resp) => {
            if (resp.status === 200){ 
                setEx(resp.data)
            }  
        });
    } catch (error) {
        console.error(error);
    }
    }

    async function addEsercizio(e : esercizio) {
        try {
            const resp =await axios.post(`${import.meta.env.VITE_API_KEY}/addEsercizi`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if(resp.status === 200){
                console.log("es aggiunto", e.nome)
            }
        } catch (error) {
            console.error("errore", error);
        }
    }

    useEffect(()=>{
        getesercizi();
    },[]);

    const handleClick = (e: esercizio) => {
        console.log("inserisci esercizio: ", e);
        addEsercizio(e);
    }

    return(
        <div>
            <table id='patienttable'>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>nome</th>
                        <th>descrizione</th>
                        <th>muscolo</th>
                        <th>difficolta</th>
                        <th>aggiungi alla scheda</th>
                    </tr>
                </thead>
                <tbody>
                    {exe.map((e)=>(
                        <tr key={e.nome}>
                            <td>{e.id}</td>
                            <td>{e.nome}</td>
                            <td>{e.descrizione}</td>
                            <td>{e.muscolo_targhet}</td>
                            <td>{e.difficolta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListaEsercizi;