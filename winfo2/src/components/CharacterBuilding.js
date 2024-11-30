import React, { useState } from 'react';
import { BeanHead } from 'beanheads';
import './CharacterBuilding.css';

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
  hatColor: 'green',
  lashes: false, // Boolean for lashes
  lipColor: 'purple',
  faceMask: false, // Boolean for faceMask
  faceMaskColor: 'white',
  mouth: 'grin',
  skinTone: 'brown',
};

const CharacterBuilding = () => {
  const [customization, setCustomization] = useState(defaultCustomization);
  const [activeTab, setActiveTab] = useState('Appearance');
  const [wallet, setWallet] = useState(100000);
  const [unlockedItems, setUnlockedItems] = useState({
    hairColor: ['black', 'brown', 'blonde'],
    clothing: ['shirt', 'vneck'],
    clothingColor: ['white'],
    graphic: ['none'],
    accessory: ['none'],
    hat: ['none'],
    hair: ['bald', 'long', 'short'],
    body: ['chest', 'breasts'],
    skinTone: ['light', 'yellow', 'brown', 'dark', 'red', 'black'],
    eyes: ['normal', 'leftTwitch', 'happy', 'content'],
    eyebrows: ['raised'],
    mouth: ['grin', 'sad', 'openSmile'],
    lashes: ['true', 'false'],
  });

  const handleCustomizationChange = (key, value) => {
    setCustomization((prev) => ({
      ...prev,
      [key]: key === 'faceMask' || key === 'lashes' ? value === 'true' : value, // Convert faceMask and lashes to boolean
    }));
  };

  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  const handleSaveAvatar = () => {
    console.log('Avatar customization saved:', customization);
  };

  const handleUnlock = (category, item) => {
    const itemCost = 100; // Cost to unlock any item
    if (wallet >= itemCost && !unlockedItems[category]?.includes(item)) {
      setWallet(wallet - itemCost);
      setUnlockedItems((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), item],
      }));
    }
  };

  const tabs = {
    Appearance: [
      { label: 'Body', key: 'body', options: ['chest', 'breasts'] },
      { label: 'Skin Tone', key: 'skinTone', options: ['light', 'yellow', 'brown', 'dark', 'red', 'black'] },
    ],
    Eyes: [
      { label: 'Eyebrows', key: 'eyebrows', options: ['raised', 'leftLowered', 'serious', 'angry', 'concerned'] },
      { label: 'Eyes', key: 'eyes', options: ['normal', 'leftTwitch', 'happy', 'content', 'squint', 'simple', 'dizzy', 'wink', 'heart'] },
      { label: 'Lashes', key: 'lashes', options: ['true', 'false'] }, // Lashes toggle
    ],
    Lips: [
      { label: 'Mouth', key: 'mouth', options: ['grin', 'sad', 'openSmile', 'lips', 'open', 'serious', 'tongue'] },
      { label: 'Lip Color', key: 'lipColor', options: ['red', 'purple', 'pink', 'green'] },
    ],
    Hair: [
      { label: 'Hair', key: 'hair', options: ['bald', 'long', 'short', 'bun', 'pixie', 'balding', 'buzz', 'afro', 'bob'] },
      { label: 'Hair Color', key: 'hairColor', options: ['black', 'brown', 'blonde', 'red', 'blue', 'pink'] },
      { label: 'Facial Hair', key: 'facialHair', options: ['none', 'stubble', 'mediumBeard'] },
    ],
    Clothing: [
      { label: 'Clothing', key: 'clothing', options: ['shirt', 'vneck', 'dressShirt', 'tankTop', 'dress'] },
      { label: 'Clothing Color', key: 'clothingColor', options: ['white', 'blue', 'black', 'green', 'red'] },
      { label: 'Graphic', key: 'graphic', options: ['none', 'redwood', 'gatsby', 'vue', 'react', 'graphQL'] },
    ],
    Accessories: [
      { label: 'Accessory', key: 'accessory', options: ['none', 'roundGlasses', 'tinyGlasses', 'shades'] },
      { label: 'Hat', key: 'hat', options: ['none', 'beanie', 'turban'] },
      { label: 'Hat Color', key: 'hatColor', options: ['white', 'blue', 'black', 'green', 'red'] },
    ],
    Extra: [
      { label: 'Face Mask', key: 'faceMask', options: ['true', 'false'] },
      { label: 'Face Mask Color', key: 'faceMaskColor', options: ['white', 'blue', 'black', 'green', 'red'] },
    ],
  };

  return (
    <div className="character-building-container">
      <div className="avatar-container">
        <div className="avatar-preview">
          <h1 className="avatar-header">Avatar Preview</h1>
          <BeanHead {...customization} mask={false} /> {/* Mask is always false */}
        </div>
        <div className="wallet-info">
          <span role="img" aria-label="coin">💰</span>
          Wallet Points: <strong>{wallet}</strong>
        </div>
        <div className="button-group">
          <button onClick={resetCustomization} className="reset-button">Reset to Default</button>
          <button onClick={handleSaveAvatar} className="save-avatar-button">Save Avatar</button>
        </div>
      </div>

      <div className="customization-panel">
        <div className="tabs">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tabs[activeTab].map(({ label, key, options }) => (
            <div key={key} style={{ marginBottom: '10px' }}>
              <h4>{label}</h4>
              <div className="options-grid">
                {options.map((option) => (
                  <div
                    key={option}
                    className={`option ${
                      String(customization[key]) === option ? 'selected' : ''
                    }`}
                    onClick={() => handleCustomizationChange(key, option)}
                  >
                    <span className={`option-preview ${key}-${option}`} />
                    <p>{option}</p>
                    {!unlockedItems[key]?.includes(option) && key !== 'faceMask' && key !== 'faceMaskColor' && (
                      <button className="unlock-button" onClick={() => handleUnlock(key, option)}>
                        Unlock (100 Points)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterBuilding;
