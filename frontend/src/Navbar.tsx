import { ReactNode, useEffect, useRef, useState } from "react";
import NavbarItem from "./NavbarItem";
import "./stylesheets/NavBar.css";
import axios from "axios";


type NavbarProps = {
    children?: ReactNode;
};

function Navbar(props: NavbarProps) {

    let navbarElements= [
    { label: "Home", href: "/" },
    { label: "Esercizi", href: "/Exercise" },
    { label: "Profilo", href: "/Profile" },
]

    const [ruolo, setRuolo] = useState<string>();

    if(ruolo === "medico" || ruolo === "personalTrainer"){
    navbarElements.push({label: "Pazienti", href: "/Pazienti"});
    }
    
    const getUtente = async () =>{
        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/getDatiUtente`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                    )}`,
                },
            })
            .then((resp) => {
                if (resp.status === 200){ 
                    setRuolo(resp.data.ruolo);
                }  
            });
        } catch (error) {
            console.error(error);        
        }
    }

    useEffect(()=>{
        getUtente();
    },[]);

    return (
        <div className="navbarContainer">
            <nav className="navbar">
                <h3>FITNESS APP</h3>
                <ul>
                    {navbarElements.map((element) => {
                        return (
                            <NavbarItem
                                key={element.href}
                                href={element.href}
                                label={element.label}
                            />
                        );
                    })}
                </ul>
                {props.children}
            </nav>
        </div>
    );
}

export default Navbar;
