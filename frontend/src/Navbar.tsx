import { ReactNode } from "react";
import NavbarItem from "./NavbarItem";
import "./stylesheets/LoginRegister.css"

const navbarElements = [
    {label: 'Home', href: '/'},
    {label: 'Pazienti', href: '/Patience'},
    {label: 'Utente', href: '/Profile'},
    {label: 'Lista Esercizi', href: '/Exercise'}
]

type NavbarProps = {
    children?: ReactNode;
}

function Navbar(props: NavbarProps) {
    return(
        <nav className="navbar">
            <ul>
                {navbarElements.map(element=>{
                    return(
                        <NavbarItem
                            key={element.href}
                            href={element.href}
                            label={element.label}
                        />
                    )
                })}
            </ul>
            {props.children}
        </nav>
    )
}

export default Navbar;