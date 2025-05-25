import TablePatient from "./TablePatient";
import TableExercise from "./TableExercise";
import axios from "axios";
import { useEffect, useState } from "react";

interface user{
    username: string;
    email : string;
    ruolo: string;
}

function Table() {
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

    if(user ===null){
        return <div>caricamento...</div>
    }else{
        if(user?.ruolo === "utente"){
            return <TableExercise/>
        }else{
            return <TablePatient/>
        }
    }
}

export default Table;