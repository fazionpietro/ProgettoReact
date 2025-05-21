import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stylesheets/table.css';

interface Paziente {
    email: string;
    name: string;
    cognome: string
}

const TablePatient: React.FC=() => {
    const [patient, setPatient] = useState<Paziente[]>([]);

    const dati = async () => {
        const headers = {Authorization: `Bearer ${localStorage.getItem("access_token")}`};
            try {
                const [paziente] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_KEY}/getPazientiNome`, {headers}),
                    //axios.get(`${import.meta.env.VITE_API_KEY}/getPazientiCognome`, {headers}),
                    //axios.get(`${import.meta.env.VITE_API_KEY}/getPazienti`, {headers}),
                ])
                //const pazienti = [...nome.data, ...cognome.data, ...email.data];

                setPatient(paziente.data);
                } catch (error) {
                    console.error(error)
                }            
        }

    useEffect(() =>{
        dati();
    },[]);


    return(
        <div>
            <table id='patienttable'>
                <thead>
                    <tr>
                        <th>nome</th>
                        <th>cognome</th>
                        <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.map((p)=> (
                        <tr key={p.email}>
                            <td>{p.name}</td>
                            <td>{p.cognome}</td>
                            <td>{p.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TablePatient;