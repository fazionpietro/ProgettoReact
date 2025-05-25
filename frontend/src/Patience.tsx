import './stylesheets/LoginRegister.css';
import Navbar from './Navbar';
import Table from './Table';

function Patience(){
    return(
        <div>
            <Navbar/>
            <div className='card'>
                <p>TABELLA PAZIENTI</p>
                <Table/>
            </div>
        </div>
    )
}

export default Patience;