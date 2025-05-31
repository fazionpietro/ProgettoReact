import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

interface exercise{
    id : number;
    scheda_id: number;
    esercizio_id: number;
    serie: number;
    ripetizioni: number;
}

interface nomeEsercizio{
    nome: string;
}

const TableSchedaDoc: React.FC = ()=>{
    const {id}= useParams<{id:string}>();
    const schedaId = id? parseInt(id,10): null;
    const {email} =useParams<{email: string}>();
    console.log("altra pagina: ", id)

    const [ex, setEx] = useState<exercise[]>([]);
    const [ne, setNE] = useState<nomeEsercizio[]>([]);
    
        //inserisci getdatiutente()
    
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
    
    const deleteEx = async (id: number, esercizio_id:number) =>{
        try {
        await axios.delete(`${import.meta.env.VITE_API_KEY}/deleteEx/${id}/${esercizio_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                "access_token"
                )}`,
            },
        })
        .then((resp) => {
            if (resp.status === 200){
                console.log('eliminato')
                setEx(prev => prev.filter(e => e.id !== id));
                getEsercizi();
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }
    
    const getEsercizi = async() =>{
        if(!email){
            console.error("email assente");
            return;
        }
    
        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/schedeEserciziUtente?email=${email}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                    )}`,
                },
            })
            .then((resp) => {
                if (resp.status === 200){ 
                    setEx(resp.data.data);
                    console.log(resp.data.data)
                }  
            });
            } catch (error) {
                console.error(error);        
            }
        }
    
    
        useEffect(()=>{
            getNomeEsercizio();
        },[]);
    
        useEffect(()=>{
            if(email){
                getEsercizi();
            }
        },[email]);
    
        const handleClick = (id : number, esercizio_id :number) =>{
            deleteEx(id, esercizio_id);
        }

    return (
        <div className="card">
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
                    {ex.filter((e) => e.scheda_id === schedaId).map((e,i) => (
                        <tr key={e.id}>
                            <td>{e.scheda_id}</td>
                            <td>{ne[i]?.nome}</td>
                            <td>{e.serie}</td>
                            <td>{e.ripetizioni}</td>
                            <td><button onClick={()=>handleClick(e.id, e.esercizio_id)}>elimina</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TableSchedaDoc;