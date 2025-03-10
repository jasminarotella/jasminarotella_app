import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Corretto import
import LandingPage from "./components/LandingPage";
import AgenteDiCommercio from './components/AgenteDiCommercio/AgenteDiCommercio';
import HomeAgente from './components/AgenteDiCommercio/Home';
import Registrazione from './components/AgenteDiCommercio/Registrazione';
import LoginHome from './components/AgenteDiCommercio/LoginHome';
import AggiungiZona from './components/AgenteDiCommercio/AggiungiZona';
import ModificaPassword from './components/AgenteDiCommercio/ModificaPassword';
import PlacesZona from './components/AgenteDiCommercio/PlacesZona';
import ZoneAgente from './components/AgenteDiCommercio/ZoneAgente';

function App() {
  return(
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/agentedicommercio" element={<AgenteDiCommercio />} />
      <Route path="/homeagente" element={<HomeAgente />} />
      <Route path="/registra-agente" element={<Registrazione />} />
      <Route path="/login-home-agente" element={<LoginHome />} />
      <Route path="/aggiungi-zona" element={<AggiungiZona />} />
      <Route path="/modifica-password" element={<ModificaPassword />} />
      <Route path="/places-zona" element={<PlacesZona />} />
      <Route path="/zone-agente" element={<ZoneAgente />} />
      <Route path="/aggiungi-zona" element={<AggiungiZona />} />
    </Routes>
  </Router>
  
  );
}

export default App;
