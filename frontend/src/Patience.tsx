import './stylesheets/LoginRegister.css';
import Navbar from './Navbar';
import TablePatient from './TablePatient';

function Patience(){
    return(
        <div>
            <Navbar/>
            <div className='card'>
                <p>TABELLA PAZIENTI</p>
                <TablePatient />
            </div>
        </div>
    )
}

export default Patience;