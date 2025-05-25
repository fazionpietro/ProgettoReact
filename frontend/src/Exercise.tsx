import './stylesheets/LoginRegister.css';
import Navbar from './Navbar';
import ListaEsercizi from './ListaEsercizi';


function Exercise(){
    return(
        <div>
            <Navbar/>
            <div className='card'>
                <p>Esercizi</p>
                <ListaEsercizi/>
            </div>
        </div>
    )
}

export default Exercise;