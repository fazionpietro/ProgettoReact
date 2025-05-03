import { ReactNode } from "react";
import NavbarItem from "./NavbarItem";

const navbarElements = [
    {label: 'Home', href: '/HomePage'},
    {label: 'Pazienti', href: '/Patience'},
    {label: 'Utente', href: '/Profile'},
    {label: 'Schede Allenamento', href: '/Exercise'}
]

type NavbarProps = {
    children?: ReactNode;
}

function Navbar(props: NavbarProps) {
    return(
        <nav>
            <ul>
                {navbarElements.map(element=>{
                    return(
                        <NavbarItem
                            key={element.href}
                            href={element.href}
                            label={element.href}
                        />
                    )
                })}
            </ul>
            {props.children}
        </nav>
    )
}

export default Navbar;