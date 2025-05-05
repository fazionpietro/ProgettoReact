import { use, useState, useEffect, useRef } from 'react';
import './stylesheets/LoginRegister.css';
import axios, {isCancel, AxiosError, Axios} from 'axios';
import { NavLink } from "react-router";



function Table(){
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState<any | null>(null);
    const token = localStorage.getItem("access_token");


    const isInitialized = useRef(false)

    const getTable= async () => {
        setIsLoading(true)
        try {
            const res = await axios.get("http://localhost:5000/api/schede", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((resp) => {
                if (resp.status === 200) setResponse(resp.data);
                console.log(resp.data);
            })

           
        } catch (error) {
            
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(isInitialized.current) return;
        isInitialized.current = true;
        getTable();
    },[])

    return (
        <>
        </>
    )
}
export default Table;
