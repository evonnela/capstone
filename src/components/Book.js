import React, { useState, useEffect, useRef } from 'react';
import { ReactReader } from 'react-reader';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import '../index.css';
import ProgressBar from './ProgressBar';

const Book = ({ onPageChange }) => {
  const [location, setLocation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [totalLocations, setTotalLocations] = useState(100); // Default value
  const [starChecked, setStarChecked] = useState({});
  const [showNotebook, setShowNotebook] = useState(false);
  const [notes, setNotes] = useState('');
  const renditionRef = useRef(null);
  const [fontSize, setFontSize] = useState(100);
  const [showSettings, setShowSettings] = useState(false);

  
const userId = localStorage.getItem('user') || 'exampleUserId'; // Use user from localStorage or default
  
  // EPUB file path
  const epubUrl = `${process.env.PUBLIC_URL}/book/thegiver.epub`;
  
  // Fetch user data (progress, bookmarks, and notes)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const progressRef = ref(db, `users/${userId}/progress`);
        const bookmarksRef = ref(db, `users/${userId}/bookmarks`);
        const notesRef = ref(db, `users/${userId}/notes`);

        const progressSnapshot = await get(progressRef);
        if (progressSnapshot.exists()) {
          const progressData = progressSnapshot.val();
          setLocation(progressData.location || null);
          setProgress(progressData.progress || 0);
        }

        const bookmarksSnapshot = await get(bookmarksRef);
        if (bookmarksSnapshot.exists()) {
          setStarChecked(bookmarksSnapshot.val() || {});
        }

        const notesSnapshot = await get(notesRef);
        if (notesSnapshot.exists()) {
          setNotes(notesSnapshot.val() || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle when the book is loaded - get total locations
  const handleBookLoad = (book) => {
    book.ready.then(() => {
      setTotalLocations(book.locations.total);
    });
  };

  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}%`);
    }
  };

  const FontSizeSettings = ({ fontSize, changeFontSize }) => (
    <div className="font-size-settings">
      <button onClick={() => changeFontSize(Math.max(50, fontSize - 10))}>-</button>
      <span>Font Size: {fontSize}%</span>
      <button onClick={() => changeFontSize(Math.min(150, fontSize + 10))}>+</button>
    </div>
  );

  // Save progress to Firebase
  const saveProgressToFirebase = (loc, calculatedProgress) => {
    set(ref(db, `users/${userId}/progress`), {
      location: loc,
      progress: calculatedProgress,
      timestamp: Date.now(),
    })
      .then(() => console.log('Progress saved successfully!'))
      .catch((error) => console.error('Error saving progress:', error));
  };

  // Handle location changes in the EPUB
  const handleLocationChanged = (loc) => {
    setLocation(loc);
    
    if (renditionRef.current) {
      // Extract current page number from location
      const currentPage = renditionRef.current.location?.start?.cfi ? 
        parseInt(renditionRef.current.location.start.displayed?.page || 1) : 1;
      
      // Call onPageChange with the current page number if provided
      if (onPageChange) onPageChange(currentPage);
      const currentLocation = renditionRef.current.location?.start?.percentage || 0;
      const calculatedProgress = Math.floor(currentLocation * 100);
      setProgress(calculatedProgress);
      saveProgressToFirebase(loc, calculatedProgress);
    }
  };

  // Toggle bookmark state at current location
  const handleStarClick = () => {
    if (!location) return;
    
    const encodedLoc = encodeURIComponent(location);
    const updatedStars = { ...starChecked, [encodedLoc]: !starChecked[encodedLoc] };
    setStarChecked(updatedStars);

    set(ref(db, `users/${userId}/bookmarks`), updatedStars)
      .then(() => console.log('Bookmark updated successfully!'))
      .catch((error) => console.error('Error saving bookmark:', error));
  };

  // Toggle notebook visibility
  const toggleNotebook = () => {
    setShowNotebook((prevState) => !prevState);
  };

  // Save notes to Firebase
  const handleSaveNotes = () => {
    set(ref(db, `users/${userId}/notes`), notes)
      .then(() => {
        console.log('Notes saved successfully!');
        toggleNotebook(); // Close notebook after saving
      })
      .catch((error) => console.error('Error saving notes:', error));
  };
  
  // Navigate to previous/next page
  const handleNavigation = (direction) => {
    if (renditionRef.current) {
      if (direction === 'prev') {
        renditionRef.current.prev();
      } else if (direction === 'next') {
        renditionRef.current.next();
      }
    }
  };



  const getRendition = (rendition) => {
    renditionRef.current = rendition;
    renditionRef.current.themes.fontSize(`${fontSize}%`);
  };

  return (
    <div className="book-container">
      {/* Header with settings and notebook button */}
      <header className="giver-header">
        <h1 className="giver-title">The Giver</h1>
        <div className="giver-buttons">
          <button className="btn-icon" aria-label="Settings" onClick={() => setShowSettings(!showSettings)}>
            <img src={`${process.env.PUBLIC_URL}/book/book_images/settings.png`} width="25" height="25" alt="settings" />
          </button> 
          <button className="btn-icon" aria-label="Notebook" onClick={toggleNotebook}>
            <img src={`${process.env.PUBLIC_URL}/book/book_images/notebook.png`} width="25" height="25" alt="notebook" />
          </button>

          <label htmlFor="star" className="star-label" aria-label="Bookmark">
            <input
              type="checkbox"
              id="star"
              className="star-checkbox"
              checked={location && starChecked[encodeURIComponent(location)] || false}
              onChange={handleStarClick}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" className="star-icon">
              <path
                d="M12 .587l3.668 7.431 8.184 1.19-5.91 5.65 1.394 8.146L12 18.897l-7.335 3.85 1.394-8.146-5.910-5.65 8.184-1.19z"
                fill={location && starChecked[encodeURIComponent(location)] ? 'orange' : 'none'}
                />
            </svg>
          </label>
        </div>
      </header>

      {showSettings && (
        <FontSizeSettings fontSize={fontSize} changeFontSize={changeFontSize} />
      )}

      {/* Notebook section */}
      {showNotebook && (
        <div className="notebook">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
          />
          <button className="save-button" onClick={handleSaveNotes}>Save</button>
        </div>
      )}

      {/* EPUB reader container */}
      <div className="book-border" style={{ height: "70vh" }}>
        {/* Uncomment after installing react-reader */}
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={handleLocationChanged}
          getRendition={getRendition}
          epubInitOptions={{
            openAs: 'epub'
          }}
          showToc={false}
          tocChanged={null}
          styles={{
            container: {
              maxWidth: '100%',
              height: '100%',
              margin: '0 auto'
            },
            readerArea: {
              padding: '20px',
              boxSizing: 'border-box',
              fontSize: `${fontSize}%` // Add this line
            }
          }}
        />
        
        
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Page Navigation */}
      <div className="page-navigation">
        <button
          className="arrow-btn left-arrow"
          aria-label="Previous Page"
          onClick={() => handleNavigation('prev')}
        >
          <img src={`${process.env.PUBLIC_URL}/book/book_images/left-arrow.png`} alt="Left Arrow" />
        </button>

        <button
          className="arrow-btn right-arrow"
          aria-label="Next Page"
          onClick={() => handleNavigation('next')}
        >
          <img src={`${process.env.PUBLIC_URL}/book/book_images/right-arrow.png`} alt="Right Arrow" />
        </button>
      </div>
    </div>
  );
};

export default Book;