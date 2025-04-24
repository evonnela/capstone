import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AccessoriesFilter from './AccessoriesFilter';
import Book from './Book';
import BookFilter from './BookFilter';
import CharacterBuilding from './CharacterBuilding';
import Home from './Home';
import Inventory from './Inventory';
import Games from './Games';
import Angryman from './Angryman';
import NavBar from './NavBar';
import Profile from './Profile';
import ProgressBar from './ProgressBar';
import Quiz from './Quiz';
import Footer from './Footer';
import SignInOut from './SignInOut';
import ChatBot from './chatbot';
import '../index.css';

export default function App() {
    const [walletPoints, setWalletPoints] = useState(0);
    const [userId, setUserId] = useState(
        localStorage.getItem('user') || 'undefined'
    );

    const getCurrentUserId = () => userId;

    return (
        <div>
            <NavBar />
            <Routes>
                <Route
                    path="/signin"
                    element={
                        <SignInOut
                            key={userId}
                            user={userId}
                            onSignIn={(id) => {
                                localStorage.setItem('user', id);
                                setUserId(id);
                            }}
                            onSignOut={() => {
                                localStorage.removeItem('user');
                                setUserId('undefined');
                            }}
                        />
                    }
                />
                <Route path="/" element={<Home />} />
                <Route
                    path="/AccessoriesFilter"
                    element={<AccessoriesFilter />}
                />
                <Route path="/Book" element={<Book />} />
                <Route path="/BookFilter" element={<BookFilter />} />
                <Route
                    path="/CharacterBuilding"
                    element={
                        <CharacterBuilding
                            userPoints={walletPoints}
                            setUserPoints={setWalletPoints}
                            userId={userId}
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
                <Route
                    path="/Profile"
                    element={
                        <Profile
                            user={userId}
                            onSignOut={() => {
                                localStorage.removeItem('user');
                                setUserId('undefined');
                            }}
                            walletPoints={walletPoints}
                            setWalletPoints={setWalletPoints}
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
