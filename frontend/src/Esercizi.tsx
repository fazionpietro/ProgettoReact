
import Navbar from './Navbar';
import ListaEsercizi from './Tabelle/ListaEsercizi';
import "./stylesheets/Esercizi.css"
import './stylesheets/newEntryButton.css'
import { useNavigate } from "react-router";


function Exercise(){
    const navigate = useNavigate();
    return(
        <div>
            <Navbar/>
            <div className='eserciziTable'>
                <h1>Esercizi</h1>
                <ListaEsercizi/>
            </div>
            <div className="newButtonContainer">
                <button className="newButton" onClick={()=> navigate("/AggiungiEsercizio")}>Nuovo Esercizio</button>
            </div>
        </div>
    )
}

export default Exercise;