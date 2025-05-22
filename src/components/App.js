import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../index';

import AccessoriesFilter from './AccessoriesFilter.js';
import Book from './Book.js';
import BookFilter from './BookFilter.js';
import CharacterBuilding from './CharacterBuilding.js';
import Home from './Home.js';
import Inventory from './Inventory.js';
import Games from './Games.js';
import Angryman from './Angryman.js';
import MemoryMatch from './MemoryMatch.js';
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
	const [userId, setUserId] = useState(localStorage.getItem('user') || 'undefined');
	const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

	useEffect(() => {
		if (userId && userId !== 'undefined') {
			const encodedId = userId.replace(/[.#$[\]]/g, '_');
			const userRef = ref(db, `users/${encodedId}/walletPoints`);
			get(userRef).then((snapshot) => {
				if (snapshot.exists()) {
					setWalletPoints(snapshot.val());
				} else {
					setWalletPoints(0);
				}
			});
		}
	}, [userId]);

	const handleSignIn = (id) => {
		setUserId(id);
		localStorage.setItem('user', id);
		setWalletPoints(0);
		setAvatarRefreshKey((prev) => prev + 1); 
	};

	const handleSignOut = () => {
		localStorage.removeItem('user');
		setUserId('undefined');
		setWalletPoints(0);
		setAvatarRefreshKey((prev) => prev + 1);
		window.location.href = '/signin';
	};

	const getCurrentUserId = () => userId;

	return (
		<div className="min-h-screen flex flex-col">
			<NavBar userId={userId} refreshKey={avatarRefreshKey} />
			<div className="flex-grow">
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
									setWalletPoints(0);
								  }}
								onSignOut={handleSignOut}
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
							<Games userPoints={walletPoints} setUserPoints={setWalletPoints} />
						}
					/>
					<Route path="/memorymatch" element={<MemoryMatch />} />
					<Route
						path="/Profile"
						element={
							<Profile
								key={userId}
								user={userId}
								walletPoints={walletPoints}
								setWalletPoints={setWalletPoints}
								onSignIn={handleSignIn}
								onSignOut={handleSignOut}
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
			</div>
			<Footer />
			<ChatBot />
		</div>
	);
}
