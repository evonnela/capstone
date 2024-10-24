import AccessoriesFilter from './components/AccessoriesFilter/AccessoriesFilter.js';
import Book from './components/Book/Book.js';
import BookFilter from './components/BookFilter/BookFilter.js';
import CharacterBuilding from './components/CharacterBuilding/CharacterBuilding.js';
import Home from './components/Home/Home.js';
import Inventory from './components/Invnetory/Inventory.js';
import MarketPlace from './components/MarketPlace/MarketPlace.js';
import NavBar from './components/NavBar/NavBar.js';
import Profile from './components/Profile/Profile.js';
import ProgressBar from './components/ProgressBar/ProgressBar.js';
import Quiz from './components/Quiz/Quiz.js';
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
  