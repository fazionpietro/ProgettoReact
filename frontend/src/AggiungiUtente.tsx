import {useState} from "react";
import "./stylesheets/LoginRegister.css";
import axios, {AxiosError, AxiosResponse } from "axios";

import { useNavigate } from "react-router";

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
        <>
            <h2>Crea Paziente</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
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
                <div>
                    <button className="loginButton" type="submit">
                        invia
                    </button>
                </div>
                <div>
                    <label className="loginError">{registerError}</label>
                </div>
            </form>
        </>
    );
}
export default AggiungiUtente;
