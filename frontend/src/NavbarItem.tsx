import { NavLink } from "react-router";

type NavbarItemProps = {
    href: string;
    label:string;
}

function NavbarItem(props: NavbarItemProps){
    return(
        <NavLink to={props.href}>
            <li>{props.label}</li>
        </NavLink>
    )
}

export default NavbarItem;