import { Link } from "react-router-dom";

const PlacesZona : React.FC = () => {
    return (
        <>
          <div className="places-zona">
                <h2>Zona : 37132</h2>
                <h3>Places:</h3>
                <ul>
                    <li>
                        <h5>San Michele Extra</h5>
                        <button>Visualizza sulla Mappa</button>
                        <button>Elimina Place</button>
                    </li>
                <button>Elimina tutti i Places</button>
                <Link to="/elimina-zona">
                <button>Elimina Zona</button></Link>
                
                </ul>
            </div>
        </>
    )
};
export default PlacesZona;