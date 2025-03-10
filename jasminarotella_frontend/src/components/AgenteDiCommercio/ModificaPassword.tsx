import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './ModificaPassword.css'
import axios from "axios";

const ModificaPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Devi essere loggato per cambiare la password.");
            return;
        }

        try {
             await axios.put(
                "http://127.0.0.1:5000/change-password",
                { new_password: newPassword },
                { headers: { "x-access-token": token } }
            );

            setMessage("✅ Password modificata con successo!");
            setTimeout(() => navigate("/login-home-agente"), 2000);
        } catch (error: any) {
            setMessage(`❌ Errore: ${error.response?.data.message || "Errore sconosciuto"}`);
        }
    };

    return (
        <>
        <h1>Modifica Password</h1>
        <div className="modifica-password">
            <label>
                Nuova Password:
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </label>
            <button onClick={handleChangePassword}>Cambia Password</button>
            {message && <p>{message}</p>}
            <Link to="/login-home-agente">
                <button>Torna alla home</button>
            </Link>
        </div>
    </>
    );
};

export default ModificaPassword;
