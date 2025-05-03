import './stylesheets/LoginRegister.css';
import Navbar from './Navbar';

function Profile(){
    return(
        <div>
            <Navbar/>
            <div className='profile'>
                <img src='../img_prova/immagine_prova.jpg' ></img>
                <h3 className='img_label'>Nome e Cognome</h3>
                <h5 className='img_label'>email</h5>
            </div>

            <div className='card'>
                <p>info Profile</p>
            </div>
        </div>
    )
}

export default Profile;