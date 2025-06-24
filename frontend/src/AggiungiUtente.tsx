import {useState} from "react";
import "./stylesheets/LoginRegister.css";
import axios, {AxiosError, AxiosResponse } from "axios";

import { NavLink, useNavigate } from "react-router";

function AggiungiUtente() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [nome, setNome] = useState<string>();
    const [cognome, setCognome] = useState<string>();
    const [registerError, setRegisterError] = useState<any>("");

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        await axios
            .post(
                `${import.meta.env.VITE_API_KEY}/signup?email=${email}&password=${password}&ruolo=utente&name=${nome}&surname=${cognome}`
            )
            .then((res: AxiosResponse) => {
                console.log(res);
                navigate("/Patience")
            })
            .catch((error: AxiosError<string>) => {
                console.error(error.response);


                if(email != "" || password != ""){
                    
                    if(email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                        setRegisterError("L'email è errata");
                    }else
                        setRegisterError("L'email o la password esistono");
                }else
                    setRegisterError("Inserisci un email o la password");

                setEmail("");
                setPassword("");
                
            });
    }

    return (
        <div className="inputPage">
            
            <form onSubmit={handleSubmit} className="inputForm">
                <div>
                    <h1>Crea Paziente</h1>
                    <input
                    className="inputLoginRegister"
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setRegisterError("");
                        }}
                    />
                </div>
                <div>
                    <input
                    className="inputLoginRegister"
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                            setRegisterError("");
                        }}
                    />
                </div>
                <div>
                    <input
                    className="inputLoginRegister"
                        type="text"
                        placeholder="Cognome"
                        name="cognome"
                        value={cognome}
                        onChange={(e) => {
                            setCognome(e.target.value);
                            setRegisterError("");
                        }}
                    />
                </div>
                <div>
                    <input
                    className="inputLoginRegister"
                        type="text"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setRegisterError("");
                        }}
                    />
                </div>
                
                <div className="loginErrorDiv">
                    <label className="loginError">{registerError}</label>
                </div>
                <div>
                    <button className="buttonLoginRegister" type="submit">
                        invia
                    </button>
                </div>
                <div>
                    <NavLink to="/Profile">Indietro</NavLink>
                </div>
            </form>
        </div>
    );
}
export default AggiungiUtente;
