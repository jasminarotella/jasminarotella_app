import React, { useState } from "react";
import axios from "axios";
import './AggiungiZona.css'
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


const AggiungiZona: React.FC = () => {
    const [cap, setCap] = useState("");
    const [message, setMessage] = useState("");

    const handleAddZone = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Devi essere loggato per aggiungere una zona.");
            return;
        }
        
        
        try {
            await axios.post(
                `${API_URL}/add-zone`,
                { cap: cap },
                { headers: { "x-access-token": token } }
            );
    
            setMessage("✅ Zona aggiunta con successo!");
        } catch (error: any) {
            setMessage(`❌ Errore: ${error.response?.data.message || "Errore sconosciuto"}`);
        }
    };
    

    return (
        <>
            <h1>Aggiungi una Zona</h1>
            <div className="aggiungi-zona">
                <label>
                    CAP:
                    <input 
                        type="text" 
                        value={cap} 
                        onChange={(e) => setCap(e.target.value)}
                    />
                </label>
                <button onClick={handleAddZone}>Aggiungi Zona</button>
                {message && <p>{message}</p>}
                <Link to="/login-home-agente">
                    <button>Torna alla home</button>
                </Link>
            </div>
        </>
    );
};

export default AggiungiZona;
