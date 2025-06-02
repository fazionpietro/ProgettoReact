import './stylesheets/Table.css';
import './stylesheets/Pazienti.css'
import Navbar from './Navbar';
import Table from './Tabelle/Table';
import { useNavigate } from 'react-router';

function Patience(){
    const navigate = useNavigate();
    return(
        <div>
            <Navbar/>
            <div className='pazientiTable'>
                <h1>PAZIENTI</h1>
                <Table/>
            </div>
            <div className="newButtonContainer">
                <button className="newButton" onClick={()=> navigate("/addUtente")}>Nuovo Paziente</button>
            </div>
        </div>
    )
}

export default Patience;