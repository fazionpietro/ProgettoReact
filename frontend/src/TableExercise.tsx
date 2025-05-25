import axios from "axios";
import { useEffect, useState } from "react";
import './stylesheets/table.css';

interface exercise{
    esercizio_id: number;
    id : number;
    ripetizioni: number;
    scheda_id: number;
    serie: number;
}

interface nomeEsercizio{
    nome: string;
}

interface user{
    username: string;
    email : string;
    role: string;
}

const TableExercise: React.FC=() =>{
    const [ex, setEx] = useState<exercise[]>([]);
    const [user, setUser] = useState<user>();
    const [ne, setNE] = useState<nomeEsercizio[]>([]);

    //inserisci getdatiutente()
    const getUtente = async () =>{
        try {
        await axios.get(`${import.meta.env.VITE_API_KEY}/getDatiUtente`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                "access_token"
                )}`,
            },
        })
        .then((resp) => {
            if (resp.status === 200){ 
                setUser(resp.data);
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }

    const getNomeEsercizio = async () =>{
        try {
        await axios.get(`${import.meta.env.VITE_API_KEY}/getNomeEsercizio`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                "access_token"
                )}`,
            },
        })
        .then((resp) => {
            if (resp.status === 200){ 
                setNE(resp.data.data);
                console.log(resp.data.data)
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }

    const getEsercizi = async() =>{
        const mail = user?.email;
        if(!mail){
            console.error("email assente");
            return;
        }

        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/schedeEserciziUtente?email=${mail}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                    )}`,
                },
            })
            .then((resp) => {
                if (resp.status === 200){ 
                    setEx(resp.data.data);
                }  
            });
            } catch (error) {
                console.error(error);        
            }
    }


    useEffect(()=>{
        getUtente();
        getNomeEsercizio();
    },[]);

    useEffect(()=>{
        if(user){
            getEsercizi();
        }
    },[user]);

    const handleClick = () =>{
        console.log("ocio che elimina");
    }

    return(
        <div>
            <table id='patienttable'>
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
                    {ex.map((e,i) => (
                        <tr>
                            <td>{e.scheda_id}</td>
                            <td>{ne[i]?.nome}</td>
                            <td>{e.serie}</td>
                            <td>{e.ripetizioni}</td>
                            <td><button onClick={handleClick}>elimina</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TableExercise;