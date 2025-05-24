import './stylesheets/LoginRegister.css';
import Navbar from './Navbar';
import TablePatient from './TablePatient';
import TableExercise from './TableExercise';

function Patience(){
    return(
        <div>
            <Navbar/>
            <div className='card'>
                <p>TABELLA PAZIENTI</p>
                {/*<TablePatient /> */}
                <TableExercise />
            </div>
        </div>
    )
}

export default Patience;