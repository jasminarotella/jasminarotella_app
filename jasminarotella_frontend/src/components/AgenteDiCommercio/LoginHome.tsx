import { Link } from "react-router-dom";
import "./LoginHome.css"; // Importa il file CSS

const LoginHome: React.FC = () => {
    return (
        <div className="agente-autorizzato-home">
            <h1>Bentornato</h1>
            <nav>
                <Link to="/zone-agente"><button>Visualizza Le tue Zone</button></Link>
                <Link to="/aggiungi-zona"><button>Aggiungi una Zona</button></Link>
                <Link to="/modifica-password"><button>Modifica Password Agente</button></Link>
            </nav>
        </div>
    );
};

export default LoginHome;
