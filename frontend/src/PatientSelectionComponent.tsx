import { useState, useEffect, useRef  } from "react";
import axios, { isCancel, AxiosError, Axios, AxiosResponse } from "axios";
import Dropdown from "./Dropdown";


type PatientSelectionComponentProps = {
    
    setSelectedPatient: (value: string) => void;
    currentSelectedPatient?: string;
    onDataFetch?: (ruolo: string , email: string) => void
};

function PatientSelectionComponent({ setSelectedPatient, currentSelectedPatient, onDataFetch }: PatientSelectionComponentProps){
    
    const [ruolo, setRuolo] = useState<string>();
  
    const [pazienti, setPazienti] = useState<{email:string}[]>();
    const isInitialized = useRef(false);



    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        getRuolo()
        getPazienti()
        
    }, []);



    const getRuolo = async () => {
        let fetchedData: {ruolo: string , email: string} | undefined
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
                        setRuolo(resp.data.ruolo); 
                        
                        fetchedData = {
                            ruolo : resp.data.ruolo,
                            email : resp.data.email
                        }
                        
                        
                        if (fetchedData && onDataFetch) {
                            onDataFetch(fetchedData.ruolo, fetchedData.email);
                        }
                    }  
                });
        } catch (error) {
            console.error(error);
            
        }
    }

    async function getPazienti(){
        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/getPazienti`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            }).then((resp) => {
                if (resp.status === 200) setPazienti(resp.data)
            })
            
        } catch (error) {
            console.error(error)
        }
    }

    function Item() {
        if(ruolo == "medico" || ruolo == "personalTrainer")   {
            return(
                <div>
                    <h4>Paziente: </h4>
                    {pazienti ? <Dropdown setSelectedValue={setSelectedPatient} 
                                            itemList={pazienti.map((item) => item.email)} 
                                            value={currentSelectedPatient}/> : ""}
                </div>
            )



        }else{
            
            return null
        }
    }


    return(
        <>
        
            {ruolo ? <Item/> : ""}
        
        </>
    )

    
}
export default PatientSelectionComponent
