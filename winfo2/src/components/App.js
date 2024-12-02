import AccessoriesFilter from './AccessoriesFilter.js';
import Book from './Book.js';
import BookFilter from './BookFilter.js';
import CharacterBuilding from './CharacterBuilding.js';
import Home from './Home.js';
import Inventory from './Inventory.js';
import MarketPlace from './MarketPlace.js';
import NavBar from './NavBar.js';
import Profile from './Profile.js';
import ProgressBar from './ProgressBar.js';
import Quiz from './Quiz.js';
import About from './About.js';
import Footer from './Footer.js'
import SignInOut from './SignInOut.js';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from 'react';
import "../index.css";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function App(props) {

  const [walletPoints, setWalletPoints] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem('user') || '');

  const getCurrentUserId = () => {
    return userId;
  }; 


    return (
        <Router>
          <div>
          <NavBar />
          <Routes>
            <Route path="/AccessoriesFilter" element={<AccessoriesFilter />} />
            <Route path="/Book" element={<Book/>} />
            <Route path="/BookFilter" element={<BookFilter/>} />
            <Route path="/CharacterBuilding" element={<CharacterBuilding walletPoints={walletPoints} setWalletPoints={setWalletPoints} userId={userId} />} />
            <Route path="/Home" element={<Home/>} />
            <Route path="/Inventory" element={<Inventory/>} />
            <Route 
            path="/MarketPlace" 
            element={
              <MarketPlace 
                userPoints={walletPoints} 
                setUserPoints={setWalletPoints} 
              />
            } 
          />
            <Route path="/NavBar" element={<NavBar/>} />
            <Route 
            path="/Profile" 
            element={
              <Profile 
                walletPoints={walletPoints} 
                setWalletPoints={setWalletPoints} 
              />
            } 
          />
            <Route path="/ProgressBar" element={<ProgressBar/>} />
            <Route path="/Quiz" element={<Quiz setWalletPoints={setWalletPoints} userId={getCurrentUserId()} />} />
            <Route path="/About" element={<About/>} />
          </Routes>
          <Footer />
          </div>
        </Router> 
    );
  }
  