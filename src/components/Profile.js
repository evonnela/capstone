import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { BeanHead } from 'beanheads';
import '../index.css';
import SignInOut from './SignInOut';

const encodeEmail = (email) => email.replace(/[.#$[\]]/g, '_');
const Profile = ({ user, onSignOut, onSignIn }) => {
	const [avatarCustomization, setAvatarCustomization] = useState(null);
	const [saveMessage, setSaveMessage] = useState('');
	const [walletPoints, setWalletPoints] = useState(null);
	const [profileInfo, setProfileInfo] = useState({
		grade: '10',
		school: 'Springfield High',
		teacher: 'Mr. Smith',
		studentId: '123456',
	});
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (!user || user === 'undefined') {
			setWalletPoints(0); // Reset on logout
			return;
		}

		const db = getDatabase();
		const userKey = encodeEmail(user);

		get(ref(db, `users/${userKey}/walletPoints`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					setWalletPoints(snapshot.val());
				} else {
					setWalletPoints(0);
				}
			})
			.catch((err) => {
				console.error('Points fetch error:', err);
				setWalletPoints(0);
			});
	}, [user]);

	const handleSave = async () => {
		const db = getDatabase();
		const userKey = encodeEmail(user);
		await set(ref(db, `users/${userKey}/profileInfo`), profileInfo);
		setEditing(false);
		setSaveMessage('Changes saved! ✅');
		setTimeout(() => setSaveMessage(''), 3000); // Clear message after 3 seconds
	};

	if (!user || user === 'undefined') {
		return (
			<SignInOut user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
		);
	}

	return (
		<div className='profile-container'>
			{avatarCustomization ? (
				<div className='profile_IMG'>
					<BeanHead {...avatarCustomization} mask={false} />
				</div>
			) : (
				<img
					className='profile_IMG'
					src='/book/book_images/user.png'
					alt='Character'
				/>
			)}

			<h1 className='username'>{user}</h1>
			<p className='points'>Points: {walletPoints ? walletPoints : 0}</p>

			<div className='student-info'>
				{editing ? (
					<>
						<label>
							Grade Level:
							<input
								value={profileInfo.grade}
								onChange={(e) =>
									setProfileInfo({
										...profileInfo,
										grade: e.target.value,
									})
								}
							/>
						</label>
						<label>
							School:
							<input
								value={profileInfo.school}
								onChange={(e) =>
									setProfileInfo({
										...profileInfo,
										school: e.target.value,
									})
								}
							/>
						</label>
						<label>
							Teacher:
							<input
								value={profileInfo.teacher}
								onChange={(e) =>
									setProfileInfo({
										...profileInfo,
										teacher: e.target.value,
									})
								}
							/>
						</label>
						<label>
							Student ID:
							<input
								value={profileInfo.studentId}
								onChange={(e) =>
									setProfileInfo({
										...profileInfo,
										studentId: e.target.value,
									})
								}
							/>
						</label>
						<button onClick={handleSave}>Save</button>
					</>
				) : (
					<>
						<p>Grade Level: {profileInfo.grade}</p>
						<p>School: {profileInfo.school}</p>
						<p>Teacher: {profileInfo.teacher}</p>
						<p>Student ID: {profileInfo.studentId}</p>
						<button onClick={() => setEditing(true)}>Edit Info</button>
					</>
				)}
				{saveMessage && <p className='saveMes'>{saveMessage}</p>}
			</div>

			<div className='sign-out-button-container'>
				<button
					onClick={() => onSignOut('undefined')}
					className='sign-out-button'
				>
					Sign Out
				</button>
			</div>
		</div>
	);
};

export default Profile;
