import AccessoriesFilter from './components/AccessoriesFilter.js';
import Book from './components/Book.js';
import BookFilter from './components/BookFilter.js';
import CharacterBuilding from './components/CharacterBuilding.js';
import Home from './components/Home.js';
import Inventory from './components/Inventory.js';
import MarketPlace from './components/MarketPlace.js';
import NavBar from './components/NavBar.js';
import Profile from './components/Profile.js';
import ProgressBar from './components/ProgressBar.js';
import Quiz from './components/Quiz.js';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

export default function App(props) {
    return (
      <div>
        <Router>
          <Routes>
            <Route path="/AccessoriesFilter" element={<AccessoriesFilter />} />
            <Route path="/Book" element={<Book/>} />
            <Route path="/BookFilter" element={<BookFilter/>} />
            <Route path="/CharacterBuilding" element={<CharacterBuilding/>} />
            <Route path="/Home" element={<Home/>} />
            <Route path="/Inventory" element={<Inventory/>} />
            <Route path="/MarketPlace" element={<MarketPlace/>} />
            <Route path="/NavBar" element={<NavBar/>} />
            <Route path="/Profile" element={<Profile/>} />
            <Route path="/ProgressBar" element={<ProgressBar/>} />
            <Route path="/Quiz" element={<Quiz/>} />
          </Routes>
        </Router> 
      </div>
    );
  }
  