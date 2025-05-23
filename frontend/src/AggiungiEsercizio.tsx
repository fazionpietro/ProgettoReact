import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./stylesheets/LoginRegister.css";
import Dropdown from "./Dropdown/Dropdown";

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
    const [muscolo, setMuscolo] = useState<string>("");
    const [difficoltaSelezionata, setDifficoltaSelezionata] = useState<string>("");
    const [creationError, setCreationError] = useState("")
    return (
        <>
            <div>
                <h2>Crea Esercizo</h2>
                <form>
                    <div>
                        <input type="text" placeholder="Nome Esercizio" name="nome" />
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
                        <h3>Descrizone: </h3>
                        <label>
                            <textarea
                                name="postContent"
                                rows={4}
                                cols={40}
                                
                            />
                        </label>
                    </div>
                    <div>
                    <button className="loginButton" type="submit">
                        invia
                    </button>
                </div>
                <div>
                    <label className="loginError">{creationError}</label>
                </div>
                </form>
            </div>
        </>
    );
}

export default AggiungiEsercizio;
