import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Home.css'
import axios from "axios";

const HomeAgente: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook per il redirect

    // Funzione per gestire il login
    const handleLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/login", {
                email: email,
                password: password,
            });

            // Salva il token nel localStorage
            localStorage.setItem("token", response.data.token);

            setMessage("✅ Login riuscito! Reindirizzamento...");

            // ⏳ Dopo 2 secondi, reindirizza alla home dell'agente
            setTimeout(() => {
                navigate("/login-home-agente");
            }, 2000);
        } catch (error: any) {
            setMessage("❌ Credenziali errate! Riprova.");
        }
    };

    return (
        <div>
            <div className="homepage-agente">
                <h2>Benvenuto</h2>
                <label>
                    Email:
                    <input 
                        type="text" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                
                {/* Bottone per il login */}
                <button onClick={handleLogin}>Login</button>

                {/* Messaggi di errore/successo */}
                {message && <p>{message}</p>}

                {/* Link per registrazione e modifica password */}
                <Link to="/registra-agente">
                    <button>Registrati</button>
                </Link>
               
            </div>
        </div>
    );
};

export default HomeAgente;
