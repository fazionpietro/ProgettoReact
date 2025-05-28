import {useState} from "react";
import "./stylesheets/LoginRegister.css";
import axios, {AxiosError,  AxiosResponse } from "axios";

import { useNavigate, NavLink } from "react-router";




function AppLogin() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();
    const [logInError, setlogInError] = useState<string>("");
   

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        await axios.post(`${import.meta.env.VITE_API_KEY}/login?email=${email}&password=${password}`
            ).then((res: AxiosResponse) => {
                console.log(res.data);
                localStorage.setItem("access_token", res.data.token);
                navigate("/");
            })
            .catch((error: AxiosError<string>) => {
                setlogInError("Email o Password non valida");
                setEmail("");
                setPassword("");
                localStorage.clear();
                console.error(error);
            });
    }

    return (
        
        <div className="card">
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setlogInError("");
                        }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setlogInError("");
                        }}
                    />
                </div>

                <div>
                    <button className="loginButton" type={"submit"}>
                        Login
                    </button>
                </div>
                <div>
                    <label className="loginError">{logInError}</label>
                </div>
                <div>
                    <NavLink to="/Register">Register</NavLink>
                </div>
            </form>
        </div>
    );
}

export default AppLogin;
