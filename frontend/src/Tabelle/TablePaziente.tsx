import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router"
import "../stylesheets/Table.css"
import Navbar from "../Navbar";

interface exercise{
    id : number;
    scheda_id: number;
    esercizio_id: number;
    serie: number;
    ripetizioni: number;
    nome_scheda: string;
    note_scheda: string;
}

const TablePaziente: React.FC =()=>{

    const [schede, setSchede] = useState<exercise[]>([]);
    const {email} = useParams<{email?:string}>();
    const navigate = useNavigate(); 

    const getUserSchede = async () =>{
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
                setSchede(resp.data.data);
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }

    useEffect(()=>{
        getUserSchede();
    },[])

    const schedeFiltrate = Array.from(
        new Map(schede.map((sc)=>[sc.scheda_id,sc])).values()
    );

    const handleClick = (id: number) =>{
        console.log("bottone: ",id)
        if(!email){
            return;
        }
        navigate(`/schedaDoc/${id}/${email}`);
    }

    return(
        <div >
            <Navbar/>
            <div className='tableContainer'>
            <h2>Email Paziente: {email}</h2>
            <table >
                <thead>
                    <tr>
                        <th>id scheda</th>
                        <th>nome</th>
                        <th>note</th>
                        <th>visualizza scheda</th>
                    </tr>
                </thead>
                <tbody>
                    {schedeFiltrate.map((sc) => (
                        <tr key={sc.scheda_id}>
                            <td>{sc.scheda_id}</td>
                            <td>{sc.nome_scheda}</td>
                            <td>{sc.note_scheda}</td>
                            <td><button className='viewButton' onClick={()=>handleClick(sc.scheda_id)}>visualizza</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className="newButtonContainer">
                <button
                    className="newButton"
                    onClick={() => navigate("/addScheda")}
                >
                    Nuova Scheda
                </button>
                <div>
                        <NavLink to="/Pazienti">Indietro</NavLink>
                </div>
            </div>
            
        </div>
    )
}

export default TablePaziente;