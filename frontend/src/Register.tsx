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
    const [ruolo, setRuolo]= useState("Utente");
    const [registerError, setRegisterError] = useState<any>("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        console.log(ruolo);
        const AxiosResponse = await axios
            .post(
                `http://localhost:5000/api/signup?email=${email}&password=${password}&ruolo=${ruolo}`
            )
            .then((res) => {
                console.log(res.data);
                localStorage.setItem("access_token", res.data.token);
                localStorage.setItem("email", res.data.email);
                navigate("/");
            })
            .catch((error: AxiosError<string>) => {
                console.error(error.response);
                setRegisterError("L'email o la password esistono");
                setEmail("");
                setRuolo("");
                setPassword("");
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
                    <Dropdown selectedValue={ruolo} setSelectedValue={setRuolo}/>
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
