import { Route, Routes } from 'react-router-dom'; // or BrowserRouter
import { useState } from 'react';
import AccessoriesFilter from './AccessoriesFilter.js';
import Book from './Book.js';
import BookFilter from './BookFilter.js';
import CharacterBuilding from './CharacterBuilding.js';
import Home from './Home.js';
import Inventory from './Inventory.js';
import Games from './Games.js';
import Angryman from './Angryman.js';
import MemoryMatch from './MemoryMatch.js'; // ✅ Add this if used
import NavBar from './NavBar.js';
import Profile from './Profile.js';
import ProgressBar from './ProgressBar.js';
import Quiz from './Quiz.js';
import Footer from './Footer.js';
import SignInOut from './SignInOut.js';
import ChatBot from './chatbot';
import '../index.css';


export default function App() {
    const [walletPoints, setWalletPoints] = useState(0);
    const [userId, setUserId] = useState(
        localStorage.getItem('user') || 'undefined'
    );
    const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

    const getCurrentUserId = () => userId;


    return (
      <div>
        <NavBar userId={userId} refreshKey={avatarRefreshKey} />
        <Routes>
          <Route
            path="/signin"
            element={
              <SignInOut
                key={userId}
                user={userId}
                onSignIn={(id) => setUserId(id)}
                onSignOut={(id) => setUserId(id)}
              />
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/AccessoriesFilter" element={<AccessoriesFilter />} />
          <Route path="/Book" element={<Book />} />
          <Route path="/BookFilter" element={<BookFilter />} />
          <Route
            path="/CharacterBuilding"
            element={
              <CharacterBuilding
                userId={userId}
                userPoints={walletPoints}
                setUserPoints={setWalletPoints}
                onAvatarSaved={() => setAvatarRefreshKey((prev) => prev + 1)}
              />
            }
          />
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
          <Route path="/memorymatch" element={<MemoryMatch />} />
          <Route
            path="/Profile"
            element={
              <Profile
                key={userId}
                user={userId}
                onSignIn={(id) => setUserId(id)}
                onSignOut={(id) => setUserId(id)}
              />
            }
          />
          <Route path="/angryman" element={<Angryman />} />
          <Route path="/ProgressBar" element={<ProgressBar />} />
          <Route
            path="/Quiz"
            element={
              <Quiz
                setWalletPoints={setWalletPoints}
                userId={getCurrentUserId()}
              />
            }
          />
        </Routes>
        <Footer />
        <ChatBot />
      </div>
    );

}

