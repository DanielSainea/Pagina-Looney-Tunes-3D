import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from "./Navbar/navbar";
import Footer from "./Footer/footer";
import PatoLucas from './ThreeModel/PatoLucas'
import LolaBunny from './LolaBunnyModel/Lola'
import BugsBunny from './BugsModel/Bugs'
import InicioCard from "./InicioCard/InicioCard";

function App() {
  return (
    <>
      <Router>
        <Navbar />  
        <Routes>
          <Route path="/" element={<InicioCard />} />
          <Route path="/ThreeModel" element={<PatoLucas />} />
          <Route path="/LolaBunnyModel" element={<LolaBunny />} />
          <Route path="/BugsModel" element={<BugsBunny />} />
        
        </Routes>
        <Footer />
       
      </Router>
    </>
  );
}

export default App
