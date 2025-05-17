import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stylesheets/table.css';

interface Paziente {
    email: string;
    role: string
}

const TablePatient: React.FC=() => {
    const [patient, setPatient] = useState<Paziente[]>([]);

    const dati = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_API_KEY}/getPazienti`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                    )}`,
                },
                }).then((resp) => {
                    if (resp.status === 200) setPatient(resp.data)
                })
                        
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
                        <th>email</th>
                        <th>role</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.map((p)=> (
                        <tr key={p.email}>
                            <td>{p.email}</td>
                            <td>{p.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TablePatient;