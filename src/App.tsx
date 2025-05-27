
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from "./Navbar/navbar";
import Footer from "./Footer/footer";
import PatoLucas from './ThreeModel/PatoLucas'
import LolaBunny from './LolaBunnyModel/Lola'


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/ThreeModel" element={<PatoLucas />} />
          <Route path="/LolaBunnyModel" element={<LolaBunny />} />
         
        </Routes>
        <Footer />
      </Router>

    </>
  );
}


export default App
