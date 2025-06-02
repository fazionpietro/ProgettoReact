import {useState} from "react";
import "./stylesheets/HomePage.css";
import axios, {AxiosError, AxiosResponse } from "axios";

import { useNavigate, NavLink } from "react-router";
import Dropdown from "./Dropdown/Dropdown";


function AppRegister() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [ruolo, setRuolo]= useState("");
    const [nome, setNome] = useState<string>();
    const [cognome, setCognome]= useState<string>();
    const [registerError, setRegisterError] = useState<any>("");
    const roleList : string[]= ["Personal Trainer", "Medico"]




    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        let realRole;
        if(ruolo == "Personal Trainer")
            realRole = "personalTrainer"
        else
            realRole = "medico"


        
        
        await axios
            .post(
                `${import.meta.env.VITE_API_KEY}/signup?email=${email}&password=${password}&ruolo=${realRole}&name=${nome}&surname=${cognome}`
            )
            .then((res: AxiosResponse) => {
                console.log(res);
                localStorage.setItem("access_token", res.data.token);
                navigate("/");
            })
            .catch((error: AxiosError<string>) => {
                console.error(error.response);
                
                if(email != "" || password != "")
                    setRegisterError("L'email o la password esistono");
                else
                    setRegisterError("Inserisci un email o la password");

                
                setRuolo("");
                setNome("");
                setCognome("");
                localStorage.clear();
            });
    }

    return (
        <div className="inputPage">
            <form onSubmit={handleRegister} className="inputForm">
                 <div>
                    <h1>Register</h1>
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
                        placeholder="nome"
                        name="name"
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
                        placeholder="cognome"
                        name="surname"
                        value={cognome}
                        onChange={(e) => {
                            setCognome(e.target.value);
                            setRegisterError("");
                        }}
                    />
                </div>
               
                <div>
                    <Dropdown setSelectedValue={setRuolo} itemList={roleList} value={ruolo}/>
                    
                </div>
                <div>
                    <input
                        className="inputLoginRegister"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setRegisterError("");
                        }}
                    />
                </div>
                <div>
                    <button className='buttonLoginRegister' type="submit">invia</button>
                </div>
                <div className="loginErrorDiv">
                    <label className="loginError">{registerError}</label>
                </div>
                <div>
                    <NavLink to="/login" end>Login</NavLink>
                </div>
            </form>
        </div>
    );
}

export default AppRegister;
