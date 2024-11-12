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
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "../index.css";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function App(props) {
    return (
        <Router>
          <div>
          <NavBar />
          <Routes>
            <Route path="/AccessoriesFilter" element={<AccessoriesFilter />} />
            <Route path="/Book" element={<Book/>} />
            <Route path="/BookFilter" element={<BookFilter/>} />
            <Route path="/CharacterBuilding" element={<CharacterBuilding/>} />
            <Route path="/Inventory" element={<Inventory/>} />
            <Route path="/MarketPlace" element={<MarketPlace/>} />
            <Route path="/NavBar" element={<NavBar/>} />
            <Route path="/Profile" element={<Profile/>} />
            <Route path="/ProgressBar" element={<ProgressBar/>} />
            <Route path="/Quiz" element={<Quiz/>} />
          </Routes>
          </div>
        </Router> 
    );
  }
  