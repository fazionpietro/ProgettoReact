import axios from 'axios';
import { useEffect, useState } from 'react';

interface esercizio {
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

    useEffect(()=>{
        getesercizi();
    },[]);

    const handleClick = () => {
        console.log("inserisci esercizio");
    }

    return(
        <div>
            <table id='patienttable'>
                <thead>
                    <tr>
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
                            <td>{e.nome}</td>
                            <td>{e.descrizione}</td>
                            <td>{e.muscolo_targhet}</td>
                            <td>{e.difficolta}</td>
                            <td><button onClick={handleClick}>butta dentro</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListaEsercizi;