import { ReactNode, useEffect, useRef, useState } from "react";
import NavbarItem from "./NavbarItem";
import "./stylesheets/NavBar.css";
import axios from "axios";


type NavbarProps = {
    children?: ReactNode;
};

let navbarElements= [
    { label: "Home", href: "/" },
    { label: "Pazienti", href: "/Pazienti" },
    { label: "Esercizi", href: "/Exercise" },
    { label: "Profilo", href: "/Profile" },
]

function Navbar(props: NavbarProps) {
    

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
