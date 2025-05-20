import { useState, useEffect } from 'react';
import { BeanHead } from 'beanheads';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import '../CharacterBuilding.css';

const defaultCustomization = {
	accessory: 'none',
	body: 'chest',
	clothing: 'shirt',
	clothingColor: 'white',
	eyebrows: 'raised',
	eyes: 'normal',
	facialHair: 'none',
	graphic: 'none',
	hair: 'bald',
	hairColor: 'black',
	hat: 'none',
	hatColor: 'white',
	lashes: false,
	lipColor: 'purple',
	faceMask: false,
	faceMaskColor: 'white',
	mouth: 'grin',
	skinTone: 'brown',
};

const CharacterBuilding = ({
	userPoints,
	setUserPoints,
	userId,
	onAvatarSaved,
}) => {
	const [customization, setCustomization] = useState(defaultCustomization);
	const [activeTab, setActiveTab] = useState('Appearance');

	const [showPopup, setShowPopup] = useState(false);
	const [selectedItemPoints, setSelectedItemPoints] = useState(0);
	const [selectedItem, setSelectedItem] = useState({ key: '', value: '' });

	const userKey = userId.replace(/[.#$[\]]/g, '_');
	const avatarRef = ref(db, `users/${userKey}/avatarCustomization`);
	const pointsRef = ref(db, `users/${userId}/walletPoints`);

	const [tabs, setTabs] = useState({
		Appearance: [
			{
				label: 'Body',
				key: 'body',
				options: [
					{ type: 'chest', locked: false, points: 0 },
					{ type: 'breasts', locked: false, points: 0 },
				],
			},
			{
				label: 'Skin Tone',
				key: 'skinTone',
				options: ['light', 'yellow', 'brown', 'dark', 'red', 'black'],
			},
		],
		Eyes: [
			{
				label: 'Eyebrows',
				key: 'eyebrows',
				options: ['raised', 'leftLowered', 'serious', 'angry', 'concerned'],
			},
			{
				label: 'Eyes',
				key: 'eyes',
				options: [
					'normal',
					'leftTwitch',
					'happy',
					'content',
					'squint',
					'simple',
					'dizzy',
					'wink',
					'heart',
				],
			},
			{ label: 'Lashes', key: 'lashes', options: ['true', 'false'] },
		],
		Lips: [
			{
				label: 'Mouth',
				key: 'mouth',
				options: [
					'grin',
					'sad',
					'openSmile',
					'lips',
					'open',
					'serious',
					'tongue',
				],
			},
			{
				label: 'Lip Color',
				key: 'lipColor',
				options: ['red', 'purple', 'pink', 'green'],
			},
		],
		Hair: [
			{
				label: 'Hair',
				key: 'hair',
				options: [
					'bald',
					'long',
					'short',
					'bun',
					'pixie',
					'balding',
					'buzz',
					'afro',
					'bob',
				],
			},
			{
				label: 'Hair Color',
				key: 'hairColor',
				options: [
					'blonde',
					'orange',
					'black',
					'white',
					'brown',
					'blue',
					'pink',
				],
			},
			{
				label: 'Facial Hair',
				key: 'facialHair',
				options: [
					{ type: 'none', locked: false, points: 0 },
					{ type: 'stubble', locked: true, points: 1000 },
					{ type: 'mediumBeard', locked: true, points: 1000 },
				],
			},
		],
		Clothing: [
			{
				label: 'Clothing',
				key: 'clothing',
				options: [
					{ type: 'shirt', locked: false, points: 0 },
					{ type: 'vneck', locked: true, points: 100 },
					{ type: 'dressShirt', locked: true, points: 200 },
					{ type: 'tankTop', locked: true, points: 500 },
					{ type: 'dress', locked: true, points: 1000 },
				],
			},
			{
				label: 'Clothing Color',
				key: 'clothingColor',
				options: [
					{ type: 'white', locked: false, points: 0 },
					{ type: 'blue', locked: true, points: 100 },
					{ type: 'black', locked: true, points: 200 },
					{ type: 'green', locked: true, points: 500 },
					{ type: 'red', locked: true, points: 1000 },
				],
			},
			{
				label: 'Graphic',
				key: 'graphic',
				options: [
					{ type: 'none', locked: false, points: 0 },
					{ type: 'redwood', locked: true, points: 100 },
					{ type: 'gatsby', locked: true, points: 200 },
					{ type: 'vue', locked: true, points: 500 },
					{ type: 'react', locked: true, points: 1000 },
					{ type: 'graphQL', locked: true, points: 2000 },
				],
			},
		],
		Accessories: [
			{
				label: 'Accessory',
				key: 'accessory',
				options: [
					{ type: 'none', locked: false, points: 0 },
					{ type: 'roundGlasses', locked: true, points: 100 },
					{ type: 'tinyGlasses', locked: true, points: 200 },
					{ type: 'shades', locked: true, points: 500 },
				],
			},
			{
				label: 'Hat',
				key: 'hat',
				options: [
					{ type: 'none', locked: false, points: 0 },
					{ type: 'beanie', locked: true, points: 100 },
					{ type: 'turban', locked: true, points: 200 },
				],
			},
			{
				label: 'Hat Color',
				key: 'hatColor',
				options: [
					{ type: 'white', locked: false, points: 0 },
					{ type: 'blue', locked: true, points: 100 },
					{ type: 'black', locked: true, points: 200 },
					{ type: 'green', locked: true, points: 500 },
					{ type: 'red', locked: true, points: 1000 },
				],
			},
		],
		Extra: [
			{
				label: 'Face Mask',
				key: 'faceMask',
				options: [
					{ type: 'false', locked: false, points: 0 },
					{ type: 'true', locked: true, points: 100 },
				],
			},
			{
				label: 'Face Mask Color',
				key: 'faceMaskColor',
				options: [
					{ type: 'white', locked: false, points: 0 },
					{ type: 'blue', locked: true, points: 100 },
					{ type: 'black', locked: true, points: 200 },
					{ type: 'green', locked: true, points: 500 },
					{ type: 'red', locked: true, points: 1000 },
				],
			},
		],
	});

	// load saved character from firebase
	useEffect(() => {
		get(avatarRef)
			.then((snapshot) => {
				if (snapshot.exists()) {
					const savedCustomization = snapshot.val();
					setCustomization(savedCustomization);
				} else {
					console.log(
						'No saved avatar found, using default customization.'
					);
				}
			})
			.catch((error) => {
				console.error('Error loading saved avatar:', error);
			});
	}, []);

	// updates character
	const handleCustomizationChange = (key, value, locked) => {
		if (!locked) {
			setCustomization((prev) => ({
				...prev,
				[key]:
					key === 'faceMask' || key === 'lashes'
						? value === 'true'
						: value,
			}));
		}
	};

	// reset character to default
	const resetCustomization = () => {
		setCustomization(defaultCustomization);
	};

	// saves character to firebase
	const handleSaveAvatar = () => {
		set(avatarRef, customization)
			.then(() => {
				console.log('Avatar saved:', customization);
				if (onAvatarSaved) onAvatarSaved(); // ✅ trigger refresh
			})
			.catch((error) => {
				console.error('Error saving avatar customization:', error);
			});
	};

	// opens confirmation popup when points button is clicked
	const handlePurchaseButton = ({ points, key, optionValue }) => {
		setShowPopup(true);
		setSelectedItemPoints(points);
		setSelectedItem({ key, value: optionValue });
	};

	// if enough points:
	// subtract from points
	// unlock item and update tabs
	const handleConfirmPurchase = () => {
		if (userPoints >= selectedItemPoints) {
			const newPoints = userPoints - selectedItemPoints;
			setUserPoints(newPoints);

			const updatedTabs = { ...tabs };
			const currentTabOptions = updatedTabs[activeTab].find(
				(tab) => tab.key === selectedItem.key
			)?.options;
			if (currentTabOptions) {
				const itemToUnlock = currentTabOptions.find(
					(option) =>
						typeof option === 'object' &&
						option.type === selectedItem.value
				);
				if (itemToUnlock) {
					itemToUnlock.locked = false;
				}
			}
			setTabs(updatedTabs);

			setCustomization((prev) => ({
				...prev,
				[selectedItem.key]: selectedItem.value,
			}));
			// ✅ Save new wallet points to Firebase
			const pointsRef = ref(db, `users/${userId}/walletPoints`);
			set(pointsRef, newPoints)
				.then(() => console.log('✅ Updated wallet points in Firebase'))
				.catch((error) =>
					console.error('❌ Error saving wallet points:', error)
				);
		}

		setShowPopup(false);
		setSelectedItemPoints(0);
		setSelectedItem({ key: '', value: '' });
	};

	// cancel and close popup
	const handleCancelPurchase = () => {
		setShowPopup(false);
	};

	// popup when purchasing an item
	const PurchasePopup = ({ onConfirm, onCancel }) => {
		return (
			<div className='popup-overlay'>
				<div className='popup-content'>
					<p>
						{userPoints >= selectedItemPoints
							? 'Are you sure you want to purchase this item?'
							: 'You dont have enough points to purchase this'}
					</p>
					<div className='popup-buttons'>
						<button
							onClick={onConfirm}
							className={`confirm-button ${
								userPoints >= selectedItemPoints ? '' : 'no-display'
							}`}
						>
							Confirm
						</button>
						<button onClick={onCancel} className='cancel-button'>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='character-building-container'>
			<div className='avatar-container'>
				<div className='avatar-preview'>
					<h1 className='avatar-header'>Avatar Preview</h1>
					<h3>Available Points: {userPoints ?? 0}</h3>
					<BeanHead {...customization} mask={false} />
				</div>
				<div className='button-group'>
					<button onClick={resetCustomization} className='reset-button'>
						Reset to Default
					</button>
					<button
						onClick={handleSaveAvatar}
						className='save-avatar-button'
					>
						Save Avatar
					</button>
				</div>
			</div>

			<div className='customization-panel'>
				<div className='tabs'>
					{Object.keys(tabs).map((tab) => (
						<button
							key={tab}
							className={`tab-button ${
								activeTab === tab ? 'active' : ''
							}`}
							onClick={() => setActiveTab(tab)}
						>
							{tab}
						</button>
					))}
				</div>

				{showPopup && (
					<PurchasePopup
						onConfirm={handleConfirmPurchase}
						onCancel={handleCancelPurchase}
					/>
				)}

				{/* customization buttons */}
				<div className='tab-content'>
					{tabs[activeTab].map(({ label, key, options }) => (
						<div key={key} style={{ marginBottom: '10px' }}>
							<h4>{label}</h4>
							<div className='options-grid'>
								{options.map((option) => {
									const optionValue =
										typeof option === 'object' ? option.type : option;
									const isLocked =
										typeof option === 'object'
											? option.locked
											: false;
									const points =
										typeof option === 'object' ? option.points : 0;

									return (
										<div
											key={`${key}-${optionValue}`}
											className={`option ${
												String(customization[key]) === optionValue
													? 'selected'
													: ''
											} ${isLocked ? 'locked' : ''} ${
												!isLocked && points > 0
													? 'unlocked-with-points'
													: ''
											}`}
											onClick={() =>
												handleCustomizationChange(
													key,
													optionValue,
													isLocked
												)
											}
										>
											<span
												className={`option-preview ${key}-${optionValue}`}
											/>
											<p>{optionValue}</p>
											{isLocked && (
												<button
													className='purchase-button'
													onClick={() =>
														handlePurchaseButton({
															points,
															key,
															optionValue,
														})
													}
												>
													{points} Points
												</button>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CharacterBuilding;
