import React, { useState, useEffect } from 'react';
import { db } from '../index'; // Firebase import
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Marketplace = ({ userId, userPoints, setUserPoints }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addedItem, setAddedItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);  // Cart state in Marketplace
  const [inventory, setInventory] = useState([]);  // Inventory state in Marketplace

  const items = [
    { id: 1, name: 'Cow Costume', category: 'all', image: '/img/cow.png', points: 100 },
    { id: 2, name: 'Purple Sneakers', category: 'shoes', image: '/img/purple.png', points: 12 },
    { id: 3, name: 'Star Tank', category: 'tops', image: '/img/tank.png', points: 10 },
    { id: 4, name: 'Platform High Heels', category: 'shoes', image: '/img/platform.png', points: 12 },
    { id: 5, name: 'White Trench Coat', category: 'coats', image: '/img/trench.png', points: 18 },
    { id: 6, name: 'Miami Off-shoulder Top', category: 'tops', image: '/img/miami.png', points: 10 },
    { id: 7, name: 'Blue Denim Skirt', category: 'bottoms', image: '/img/denimSkirt.png', points: 12 },
    { id: 8, name: 'Green Camo Skirt', category: 'bottoms', image: '/img/camoSkirt.png', points: 12 },
    { id: 9, name: 'Fluffy Brown Boots', category: 'shoes', image: '/img/fluffyBoots.png', points: 15 },
    { id: 10, name: 'Black Sunglasses', category: 'accessories', image: '/img/sunglasses.png', points: 8 },
    { id: 11, name: 'Red Hat', category: 'accessories', image: '/img/redCap.png', points: 10 },
    { id: 12, name: 'Gold Necklace', category: 'accessories', image: '/img/necklace.png', points: 9 },
    { id: 13, name: 'Light Wash Jeans', category: 'bottoms', image: '/img/lightWash.png', points: 15 },
    { id: 14, name: 'Orange T-shirt', category: 'tops', image: '/img/shirt.png', points: 12 }
  ];

  // Fetch user data (cart, inventory) from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCart(data.cart || []);  // Initialize cart
        setInventory(data.inventory || []);  // Initialize inventory
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Update Firestore data
  const updateUserData = async () => {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      points: userPoints,
      cart: cart,
      inventory: inventory,
    });
  };

  useEffect(() => {
    if (userId) {
      updateUserData(); // Update user data whenever points, cart, or inventory changes
    }
  }, [userId, cart, inventory, userPoints]);

  const handleAddToCart = (item) => {
    const totalPointsSpent = cart.reduce((total, item) => total + item.points, 0);
    if (userPoints - totalPointsSpent - item.points >= 0) {
      setCart(prevCart => [...prevCart, item]);
      setAddedItem(item.name);
      setTimeout(() => setAddedItem(null), 2000); // Display a temporary success message
    } else {
      alert('Not enough points!');
    }
  };

  const handleCheckout = () => {
    const totalPointsSpent = cart.reduce((total, item) => total + item.points, 0);
    if (totalPointsSpent <= userPoints) {
      setUserPoints(userPoints - totalPointsSpent); // Deduct points
      setInventory(prevInventory => [...prevInventory, ...cart]);
      setCart([]);
      alert('Checkout successful!');
    } else {
      alert('You do not have enough points to checkout.');
    }
    setIsCartOpen(false); // Close the cart modal
  };

  // Define filteredItems based on searchQuery and categoryFilter
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  return (
    <div>
      <h1>Marketplace</h1>
      {/* Shop Header */}
      <header className="shop-header">
        <div className="cart-container" onClick={() => setIsCartOpen(true)}>
          <img className="cart-icon" src="/img/cart.png" alt="Shopping Cart" />
          <span className="cart-count">{cart.length}</span>
        </div>
        <div className="user-points">
          <h3>Available Points: {userPoints}</h3>
          <h4>Points Remaining: {userPoints - cart.reduce((total, item) => total + item.points, 0)}</h4>
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
  
      {/* Main Content with Categories and Items */}
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
                      disabled={userPoints - cart.reduce((total, item) => total + item.points, 0) < item.points}
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
  
      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <h2>Shopping Cart</h2>
            <ul>
              {cart.length > 0 ? (
                cart.map(item => (
                  <li key={item.id}>
                    <img src={item.image} alt={item.name} style={{ width: '50px' }} />
                    <span className="item-name">{item.name}</span>
                    <span className="cart-points">{item.points} points</span>
                  </li>
                ))
              ) : (
                <li>Your cart is empty</li>
              )}
            </ul>
            <div className="cart-footer">
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
