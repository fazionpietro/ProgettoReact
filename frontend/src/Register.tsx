import { use, useState, useEffect } from "react";
import "./stylesheets/LoginRegister.css";
import axios, { isCancel, AxiosError, Axios, AxiosResponse } from "axios";
import { Card} from "react-bootstrap";
import { useNavigate, NavLink } from "react-router";
import Dropdown from "./Dropdown";

type response = {
    status: number;
    data: {
        email: string;
        token: string;
    };
};
function AppRegister() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [ruolo, setRuolo]= useState("");
    const [nome, setNome] = useState<string>();
    const [cognome, setCognome]= useState<string>();
    const [registerError, setRegisterError] = useState<any>("");
    const roleList : string[]= ["utente", "personalTrainer", "medico"]




    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        console.log(email, password, ruolo, nome, cognome);
        
        const AxiosResponse = await axios
            .post(
                `${import.meta.env.VITE_API_KEY}/signup?email=${email}&password=${password}&ruolo=${ruolo}&name=${nome}&surname=${cognome}`
            )
            .then((res: AxiosResponse) => {
                console.log(res);
                localStorage.setItem("access_token", res.data.token);
                navigate("/");
            })
            .catch((error: AxiosError<string>) => {
                console.error(error.response);
                setRegisterError("L'email o la password esistono");
                setEmail("");
                setRuolo("");
                setPassword("");
                setNome("");
                setCognome("");
                localStorage.clear();
            });
    }

    return (
        <div className="card">
            <form onSubmit={handleRegister}>
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
                    <button className='loginButton' type="submit">invia</button>
                </div>
                <div>
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
