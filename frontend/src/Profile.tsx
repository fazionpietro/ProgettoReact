import './stylesheets/LoginRegister.css';
import Navbar from './Navbar';
import Table from './Table';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface user{
    username: string;
    email : string;
    ruolo: string;
}

function Profile(){
    const [user, setUser] = useState<user>();

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

    useEffect(()=>{
        getUtente();
    },[]);

    return(
        <div>
            <Navbar/>
            <div className='profile'>
                <h1 className='img_label'>Benvenuto: {user?.username}</h1>
                <h3 className='img_label'>{user?.email}</h3>
            </div>

            <div className='card'>
                <p>info Profile</p>
                <Table/>
            </div>
        </div>
    )
}

export default Profile;