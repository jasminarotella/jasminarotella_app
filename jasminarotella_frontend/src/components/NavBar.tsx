import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav id="nav-main">
            <ul>
                
                <li>
                <Link to="#banner"> Home
                </Link></li>
                <li><a href="/agentedicommercio">Simulazione Agente di Commercio</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#services">Services</a></li>
            </ul>
        
        </nav>
    );
}

export default Navbar;
