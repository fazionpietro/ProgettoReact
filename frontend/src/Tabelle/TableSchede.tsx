import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import '../stylesheets/Table.css'


interface user{
    username: string;
    email : string;
    role: string;
}

interface exercise{
    esercizio_id: number;
    id : number;
    nome_scheda: string;
    note: string;
    ripetizioni: number;
    scheda_id: number;
    serie: number;

}

const TableSchede: React.FC=() =>{
    
    const [user, setUser] = useState<user>();
    const [schede, setSchede] = useState<exercise[]>([]);
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
                
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }

    const getUserSchede = async () =>{
        try {
        await axios.get(`${import.meta.env.VITE_API_KEY}/schedeEserciziUtente?email=${user?.email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                "access_token"
                )}`,
            },
        })
        .then((resp) => {
            if (resp.status === 200){
                setSchede(resp.data.data);
                console.log(resp.data.data);
            }  
        });
        } catch (error) {
            console.error(error);        
        }
    }

    const deleteSCheda = async (id: number) => {
        try {
            await axios
                .delete(
                    `${
                        import.meta.env.VITE_API_KEY
                    }/deleteScheda/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                            )}`,
                        },
                    }
                )
                .then((resp) => {
                    if (resp.status === 200) {
                        console.log("eliminato");
                        setSchede((prev)=>prev.filter((sched)=> sched.scheda_id !== id));
                        getUserSchede();
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        getUtente();
    },[]);

    useEffect(()=>{
        if(user){
            getUserSchede();
        }
    },[user]);

    

    const handleClick = (id: number) =>{
        navigate(`/scheda/${id}`);
    }

    const handleOnClick = (id: number) =>{
        deleteSCheda(id);
    }

    const schedeFiltrate = Array.from(
        new Map(schede.map((sc)=>[sc.scheda_id,sc])).values()
    );

    return(
        <div className="tableContainer">
            <table >
                <thead>
                    <tr>
                        
                        <th>nome</th>
                        <th>note</th>
                        <th>visualizza scheda</th>
                        <th>elimina scheda</th>
                    </tr>
                </thead>
                <tbody>
                    {schedeFiltrate.map((sc) => (
                        <tr key={sc.scheda_id}>
                            
                            <td>{sc.nome_scheda}</td>
                            <td>{sc.note}</td>
                            <td><button className='viewButton' onClick={()=>handleClick(sc.scheda_id)}>visualizza</button></td>
                            <td><button className='delButton' onClick={()=>handleOnClick(sc.scheda_id)}>elimina</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
        
    )
};

export default TableSchede;