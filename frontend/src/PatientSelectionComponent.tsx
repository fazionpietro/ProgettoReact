import { useState, useEffect, useRef  } from "react";
import axios, { isCancel, AxiosError, Axios, AxiosResponse } from "axios";
import Dropdown from "./Dropdown";


type PatientSelectionComponentProps = {
    
    setSelectedPatient: (value: string) => void;
    currentSelectedPatient?: string;
    onEmailFetch?: (email: string) => void
};

function PatientSelectionComponent({ setSelectedPatient, currentSelectedPatient, onEmailFetch }: PatientSelectionComponentProps){
    
    const [email, setEmail] = useState()
    const [ruolo, setRuolo] = useState<string>();
    const [pazienti, setPazienti] = useState<{paziente:string}[]>();
    const isInitialized = useRef(false);



    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        getData()
    }, []);



    const getData = async () => {
        let fetchedEmail: string | undefined
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
                        // setEmail(resp.data.email); // You might not need this state anymore
                        fetchedEmail = resp.data.email; // Store email locally
                        
                        // Call the callback function if it was provided
                        if (fetchedEmail && onEmailFetch) {
                            onEmailFetch(fetchedEmail);
                        }
                    }  
                });

                if (!fetchedEmail) {
                    console.error("Email non trovato per recuperare i pazienti.");
                    return; 
                 }
                await axios.get(`${import.meta.env.VITE_API_KEY}/getPazienti?email=${fetchedEmail}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }).then((resp) => {
                    if (resp.status === 200) setPazienti(resp.data)
                })
        } catch (error) {
            console.error(error);
            
        }
    }

    function Item() {
        if(ruolo == "medico" || ruolo == "personalTrainer")   {
            return(
                <div>
                    <h4>Paziente: </h4>
                    {pazienti ? <Dropdown setSelectedValue={setSelectedPatient} 
                                            itemList={pazienti.map((item) => item.paziente)} 
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
