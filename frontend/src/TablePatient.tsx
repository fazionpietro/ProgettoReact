import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stylesheets/table.css';

interface Paziente {
    email: string;
    name: string;
    surname : string;
    ruolo : string;
}

const TablePatient: React.FC=() => {
    const [patient, setPatient] = useState<Paziente[]>([]);

    const getDati = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/getAllIdenty`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            })
            .then((resp) => {
                if (resp.status === 200){ 
                    setPatient(resp.data)
                }  
            });
        } catch (error) {
            console.error(error);
                
        }
    }

    const deleteUtente = async (email: string) =>{
        try {
        await axios.delete(`${import.meta.env.VITE_API_KEY}/deleteUtente/${email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                "access_token"
                )}`,
            },
        })
        .then((resp) => {
            if (resp.status === 200){
                console.log('eliminato')
                setPatient(prev => prev.filter(e => e.email !== email));
                getDati();
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }

    useEffect(() =>{
        getDati();
    },[]);

    const handleClick = (e : string) =>{
        console.log("ocio che elimina");
        deleteUtente(e);
    };

    return(
        <div>
            <table id='patienttable'>
                <thead>
                    <tr>
                        <th>nome</th>
                        <th>cognome</th>
                        <th>email</th>
                        <th>elimina utente</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.filter((p)=> p.ruolo === "utente").map((p)=> (
                        <tr key={p.email}>
                            <td>{p.name}</td>
                            <td>{p.surname}</td>
                            <td>{p.email}</td>
                            <td><button onClick={()=>handleClick(p.email)}>elimina</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TablePatient;