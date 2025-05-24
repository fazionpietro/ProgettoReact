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

interface user{
    username: string;
    email : string;
    role: string;
}

const TableExercise: React.FC=() =>{
    const [ex, setEx] = useState<exercise[]>([]);
    const [user, setUser] = useState<user>();

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
                    console.log("dati: ", resp.data.data);
                }  
            });
            } catch (error) {
                console.error(error);        
            }
    }


    useEffect(()=>{
        getUtente();
    },[]);

    useEffect(()=>{
        if(user){
            getEsercizi();
        }
    },[user]);

    return(
        <div>
            <table id='patienttable'>
                <thead>
                    <tr>
                        <th>schedaId</th>
                        <th>esercizioId</th>
                        <th>serie</th>
                        <th>ripetizioni</th>
                    </tr>
                </thead>
                <tbody>
                    {ex.map((e) => (
                        <tr>
                            <td>{e.scheda_id}</td>
                            <td>{e.esercizio_id}</td>
                            <td>{e.serie}</td>
                            <td>{e.ripetizioni}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TableExercise;