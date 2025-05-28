import { useState} from "react";
import axios from "axios";
import "./stylesheets/LoginRegister.css";
import Dropdown from "./Dropdown/Dropdown";
import esercizioData from "./types/esercizioType";

function AggiungiEsercizio() {
    const muscoliTarghet  = [
        "Abduttori", 
        "Addominali", 
        "Adduttori", 
        "Avambracci", 
        "Bicipiti", 
        "Collo", 
        "Corpo intero", 
        "Dorsali", 
        "Glutei", 
        "Parte bassa della schiena", 
        "Parte superiore della schiena",
        "Petto",
        "Polpacci",
        "Quadricipiti",
        "Spalle",
        "Femorali",
        "Trapezi",
        "Tricipiti", 
        "Alto"
    ]
    const difficolta = ["facile", "medio", "difficile"]
    const [nome, setNome] = useState<string>("")
    const [muscolo, setMuscolo] = useState<string>("");
    const [difficoltaSelezionata, setDifficoltaSelezionata] = useState<string>("");
    const [creationError, setCreationError] = useState<string>("")
    const [descrizione, setDescrizione] = useState<string>("")  



    async function createExercise(){

        if(nome == "" || muscolo == "" || difficoltaSelezionata =="" || descrizione == ""){
            console.error("Devi compilare tutti i campi")
            setCreationError("Devi compilare tutti i campi")
        
            return
        }else{
            setCreationError("")
        }
        
        const data : esercizioData = {
            nome : nome,
            descrizione : descrizione,
            muscolo_targhet: muscolo,
            difficolta : difficoltaSelezionata
        }
        
        
        await axios.post(
            `${import.meta.env.VITE_API_KEY}/addEsercizi`, 
            JSON.stringify(data), 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                console.log(response)
                setNome("")
                setMuscolo("")
                setDifficoltaSelezionata("")
                setDescrizione("")
                setCreationError("Esercizio creato con successo")
            })
            .catch((e:any) =>{
                console.error(e)
                
                setCreationError("Errore nella creazione dell'Esercizio")
            })
    }






    return (
        <>
            <div>
                <h2>Crea Esercizo</h2>
                <form>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Nome Esercizio" 
                            name="nome" 
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value)
                            }}
                        />
                    </div>
                    <div>
                        <h4>
                            Muscolo targhet: 
                        </h4>
                        <Dropdown setSelectedValue={setMuscolo} itemList={muscoliTarghet} value={muscolo}/>

                    </div>
                    <div>
                        <h4>
                            Difficoltà:
                        </h4>
                        
                        <Dropdown setSelectedValue={setDifficoltaSelezionata} itemList={difficolta} value={difficoltaSelezionata}/> 
                    </div>
                    <div>
                       <h4>Descrizione: </h4>
                        <label>
                            <textarea
                                name="postContent"
                                placeholder="Descrizione Esercizio"
                                value={descrizione}
                                rows={4}
                                cols={40}
                                onChange={(e) => setDescrizione(e.target.value)}
                            />
                        </label>
                    </div>
                    
                </form>
                <div>
                    <h2>{creationError}</h2>
                </div>
                <div>
                    <button className="loginButton" onClick={createExercise}>
                        invia
                    </button>
                </div>
                
            </div>
        </>
    );
}

export default AggiungiEsercizio;
