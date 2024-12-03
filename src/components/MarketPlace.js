import React, { useState, useEffect } from 'react';
import { db } from '../index'; // Firebase import
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Import images
import cow from '../img/cow.png';
import purple from '../img/purple.png';
import tank from '../img/tank.png';
import platform from '../img/platform.png';
import trench from '../img/trench.png';
import miami from '../img/miami.png';
import denimSkirt from '../img/denimSkirt.png';
import camoSkirt from '../img/camoSkirt.png';
import fluffyBoots from '../img/fluffyBoots.png';
import sunglasses from '../img/sunglasses.png';
import redCap from '../img/redCap.png';
import necklace from '../img/necklace.png';
import lightWash from '../img/lightWash.png';
import shirt from '../img/shirt.png';
import cartImg from '../img/cart.png';

const Marketplace = ({ userId, userPoints, setUserPoints }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [pointsRemaining, setPointsRemaining] = useState(userPoints);  // Start with passed points

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Predefined items available in the marketplace
  const items = [
    { id: 1, name: 'Cow Costume', category: 'all', image: cow, points: 100 },
    { id: 2, name: 'Purple Sneakers', category: 'shoes', image: purple, points: 200 },
    { id: 3, name: 'Star Tank', category: 'tops', image: tank, points: 1000 },
    { id: 4, name: 'Platform High Heels', category: 'shoes', image: platform, points: 1200 },
    { id: 5, name: 'White Trench Coat', category: 'coats', image: trench, points: 1800 },
    { id: 6, name: 'Miami Off-shoulder Top', category: 'tops', image: miami, points: 300 },
    { id: 7, name: 'Blue Denim Skirt', category: 'bottoms', image: denimSkirt, points: 1200 },
    { id: 8, name: 'Green Camo Skirt', category: 'bottoms', image: camoSkirt, points: 1200 },
    { id: 9, name: 'Fluffy Brown Boots', category: 'shoes', image: fluffyBoots, points: 1500 },
    { id: 10, name: 'Black Sunglasses', category: 'accessories', image: sunglasses, points: 500 },
    { id: 11, name: 'Red Hat', category: 'accessories', image: redCap, points: 1000 },
    { id: 12, name: 'Gold Necklace', category: 'accessories', image: necklace, points: 600 },
    { id: 13, name: 'Light Wash Jeans', category: 'bottoms', image: lightWash, points: 1500 },
    { id: 14, name: 'Orange T-shirt', category: 'tops', image: shirt, points: 1200 },
  ];

  // Fetch user data (cart, inventory) from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCart(data.cart || []);
        setInventory(data.inventory || []);
        setPointsRemaining(data.points || 50);
      }
    };

    fetchUserData();
  }, [userId]);

  const updateUserData = async () => {
    if (!userId) return;
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        points: pointsRemaining,
        cart: cart,
        inventory: inventory
      });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    updateUserData();
  }, [userId, cart, inventory, pointsRemaining]);

  const handleAddToCart = (item) => {
    const totalPointsSpent = cart.reduce((total, item) => total + item.points, 0);
    if (pointsRemaining - totalPointsSpent - item.points >= 0) {
      setCart(prevCart => [...prevCart, item]);
      setPointsRemaining(prevPoints => prevPoints - item.points);
    } else {
      alert('Not enough points!');
    }
  };

  const handleCheckout = async () => {
    const totalPointsSpent = cart.reduce((total, item) => total + item.points, 0);
    
    if (totalPointsSpent <= pointsRemaining) {
      // Update points and inventory
      setUserPoints(pointsRemaining - totalPointsSpent);
      setPointsRemaining(pointsRemaining - totalPointsSpent);

      // Add items from cart to inventory
      setInventory(prevInventory => [...prevInventory, ...cart]);

      // Clear the cart
      setCart([]);

      // Update Firestore (user data)
      await updateUserData();

      alert('Checkout successful!');
    } else {
      alert('You do not have enough points to checkout.');
    }
    
    setIsCartOpen(false); // Close the cart modal
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPointsSpent = cart.reduce((total, item) => total + item.points, 0);

  return (
    <div>
      <h1 className="marketplace">Marketplace</h1>
      <header className="shop-header">
        <div className="cart-container" onClick={() => setIsCartOpen(true)}>
          <img className="cart-icon" src={cartImg} alt="Shopping Cart" />
          <span className="cart-count">{cart.length}</span>
        </div>
        <div className="user-points">
          <h3>Available Points: {pointsRemaining}</h3>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={() => setSearchQuery('')}>Search</button>
        </div>
      </header>

      <div className="main-content-marketplace">
        <div className="categories">
          {['all', 'tops', 'bottoms', 'coats', 'shoes', 'accessories'].map(category => (
            <p
              key={category}
              className={`category-filter ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
          ))}
        </div>

        <div className="items-page">
          <div className="items-wrapper">
            <ul className="items-displayed">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <li key={item.id} className="item">
                    <img className="purchase-item" src={item.image} alt={item.name} />
                    <span className="item-name">{item.name}</span>
                    <span className="item-points">{item.points} points</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={pointsRemaining - totalPointsSpent < item.points}
                    >
                      Add to Cart
                    </button>
                  </li>
                ))
              ) : (
                <li>No items found</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {isCartOpen && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <h2>Shopping Cart</h2>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  <img className="item-photo" src={item.image} alt={item.name} />
                  <span className="item-name">{item.name}</span>
                  <span className="item-points">{item.points} points</span>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <p>Total Points: {totalPointsSpent}</p>
              <button onClick={handleCheckout}>Checkout</button>
              <button onClick={() => setIsCartOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
