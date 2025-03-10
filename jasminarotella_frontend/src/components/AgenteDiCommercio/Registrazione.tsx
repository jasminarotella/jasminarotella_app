import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Registrazione: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook per la navigazione

    // Funzione per gestire la registrazione
    const handleRegister = async () => {
        try {
            
             await axios.post(`${API_URL}/register`,{
                email: email,
                password: password,
            });

            // Se la registrazione va a buon fine
            setMessage(`✅ Registrazione riuscita! Reindirizzamento...`);

            // ⏳ Aspetta 2 secondi e reindirizza a LoginHome
            setTimeout(() => {
                navigate("/homeagente");
            }, 2000);
        } catch (error: any) {
            if (error.response) {
                setMessage(`❌ Errore: ${error.response.data.message}`);
            } else {
                setMessage("❌ Errore sconosciuto.");
            }
        }
    };

    return (
        <>
            <h1>Registra un nuovo agente</h1>
            <div className="homepage-agente">
                <label>Email:
                    <input 
                        type="text" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button onClick={handleRegister}>Registrati</button>
                {message && <p>{message}</p>}
                <Link to="/homeagente">
                    <button>Torna al login</button>
                </Link>
            </div>
            
        </>
    );
};

export default Registrazione;
