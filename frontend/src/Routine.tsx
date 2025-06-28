import './stylesheets/Table.css';
import './stylesheets/Profile.css'
import Navbar from './Navbar';
import Table from './Tabelle/Table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface user{
    username: string;
    email : string;
    ruolo: string;
}

function Profile(){
    const [user, setUser] = useState<user>();
    const [ruolo, setRuolo] = useState<string>();
    const navigate = useNavigate();

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
                    setRuolo(resp.data.ruolo);
                }  
            });
        } catch (error) {
            console.error(error);        
        }
    }

    useEffect(()=>{
        getUtente();
    },[]);

    return(
        <div >
            <Navbar/>
            <div className='profileContainer'>
                <div className='profile'>
                    <h1 >Benvenuto: {user?.username}</h1>
                    <h3>{user?.email}</h3>
                </div>
                <div>
                    <p>{ruolo=="utente" ? "Routine" : "Pazienti"}</p>
                    <Table/>
                </div>
            </div>
           
        ;   {(ruolo == "utente" ?  <></> : 
            <><div className="newButtonContainer">
                <button className="newButton" onClick={()=> navigate("/addUtente")}>Nuovo Paziente</button>
            </div></>)}       
            
        </div>
    )
}

export default Profile;