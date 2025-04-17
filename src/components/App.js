import AccessoriesFilter from './AccessoriesFilter.js';
import Book from './Book.js';
import BookFilter from './BookFilter.js';
import CharacterBuilding from './CharacterBuilding.js';
import Home from './Home.js';
import Inventory from './Inventory.js';
import Games from './Games.js';
import Angryman from './Angryman.js';
import NavBar from './NavBar.js';
import Profile from './Profile.js';
import ProgressBar from './ProgressBar.js';
import Quiz from './Quiz.js';
import Footer from './Footer.js';
import SignInOut from './SignInOut.js';
import ChatBot from './chatbot';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from 'react';
import "../index.css";
<<<<<<< HEAD
import { pdfjs } from 'react-pdf';

/* pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString(); */
=======
>>>>>>> origin/main

export default function App(props) {

  const [walletPoints, setWalletPoints] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem('user') || '');

  const getCurrentUserId = () => {
    return userId;
  };

  return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/AccessoriesFilter" element={<AccessoriesFilter />} />
          <Route path="/Book" element={<Book />} />
          <Route path="/BookFilter" element={<BookFilter />} />
          <Route path="/CharacterBuilding" element={<CharacterBuilding userPoints={walletPoints} setUserPoints={setWalletPoints} userId={userId} />} />
          <Route path="/" element={<Home />} />
          <Route path="/Inventory" element={<Inventory />} />
          <Route 
            path="/Games" 
            element={
              <Games 
                userPoints={walletPoints} 
                setUserPoints={setWalletPoints} 
              />
            } 
          />
          <Route path="/NavBar" element={<NavBar />} />
          <Route 
            path="/Profile" 
            element={
              <Profile 
                walletPoints={walletPoints} 
                setWalletPoints={setWalletPoints} 
              />
            } 
          />
          <Route path="/angryman" element={<Angryman />} />
          <Route path="/ProgressBar" element={<ProgressBar />} />
          <Route path="/Quiz" element={<Quiz setWalletPoints={setWalletPoints} userId={getCurrentUserId()} />} />
        </Routes>
        <Footer />
        <ChatBot />
      </div>
  );
}