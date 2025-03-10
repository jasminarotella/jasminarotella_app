import React, { useEffect, useState } from "react";
import axios from "axios";
import './ZoneAgente.css'
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ZoneAgente: React.FC = () => {
    const [caps, setCaps] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [places, setPlaces] = useState<{ [key: string]: string[] }>({});
    const [selectedCap, setSelectedCap] = useState<string | null>(null);

    // Carica i CAP dell'agente
    useEffect(() => {
        const fetchCaps = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("❌ Devi essere loggato per vedere le tue zone.");
                return;
            }

            try {
                const response = await axios.post(
                    `${API_URL}/list-caps`,
                    {},
                    { headers: { "x-access-token": token } }
                );

                setCaps(response.data.caps);
            } catch (error: any) {
                setMessage(`❌ Errore: ${error.response?.data.message || "Errore sconosciuto"}`);
            }
        };

        fetchCaps();
    }, []);

    // Visualizza i Places associati a un CAP
    const fetchPlaces = async (cap: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Devi essere loggato.");
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/get-places/${cap}`,
                { headers: { "x-access-token": token } }
            );

            setPlaces((prevPlaces) => ({
                ...prevPlaces,
                [cap]: response.data.places
            }));
            setSelectedCap(cap);
        } catch (error: any) {
            setMessage(`❌ Errore nel caricamento dei Places.`);
        }
    };

    // Elimina una zona
    const deleteZone = async (cap: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Devi essere loggato.");
            return;
        }

        try {
            await axios.delete(
               `${API_URL}/delete-zone/${cap}`,
                { headers: { "x-access-token": token } }
            );

            setCaps(caps.filter((c) => c !== cap));
            setMessage(`✅ Zona ${cap} eliminata con successo!`);
        } catch (error: any) {
            setMessage(`❌ Errore nell'eliminazione della zona.`);
        }
    };

    // Elimina un singolo place dalla zona (utilizza CAP e nome del place)
    const deletePlace = async (cap: string, place: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Devi essere loggato.");
            return;
        }

        try {
            await axios.delete(`${API_URL}/delete-place`, {
                headers: { "x-access-token": token },
                data: { cap: cap, place_name: place }
            });


            // Aggiorna lo stato rimuovendo il place eliminato
            setPlaces((prevPlaces) => ({
                ...prevPlaces,
                [cap]: prevPlaces[cap].filter((p) => p !== place)
            }));
            setMessage(`✅ Place ${place} eliminato con successo dalla zona ${cap}!`);
        } catch (error: any) {
            setMessage(`❌ Errore nell'eliminazione del place.`);
        }
    };

    const deleteAllPlaces = async (cap: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Devi essere loggato.");
            return;
        }
        try {
            await axios.delete(`${API_URL}/delete-all-places`, {
                headers: { "x-access-token": token },
                data: { cap: cap } // Passa il CAP nel body della richiesta
            });
            setPlaces((prevPlaces) => ({
                ...prevPlaces,
                [cap]: [] // Svuota la lista dei place per questo CAP
            }));
            setMessage(`✅ Tutti i place della zona ${cap} eliminati con successo!`);
        } catch (error: any) {
            setMessage(`❌ Errore nell'eliminazione dei place della zona ${cap}.`);
        }
    };

    return (
        <div className="zone-agente">
            <h2>Le tue Zone</h2>
            <Link to="/login-home-agente">
                <button>Torna alla home</button>
            </Link>
            {message && <p>{message}</p>}
            <ul>
                {caps.map((cap) => (
                    <li key={cap} className="zona">
                        <p>{cap}</p>
                        <button onClick={() => fetchPlaces(cap)}>Visualizza Places associati</button>
                        <button onClick={() => deleteZone(cap)}>Elimina Zona</button>
                        <button onClick={() => deleteAllPlaces(cap)}>Elimina Places</button>

                        {/* Mostra i Places se il CAP è selezionato */}
                        {selectedCap === cap && places[cap] && (
                            <ul>
                                {places[cap].map((place, index) => (
                                    <li key={index}>
                                        {place}{" "}
                                        <button onClick={() => deletePlace(cap, place)}>x</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ZoneAgente;
