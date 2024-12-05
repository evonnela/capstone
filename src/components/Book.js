import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import '../index.css';
import ProgressBar from './ProgressBar';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js";

const Book = ({ onPageChange }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [starChecked, setStarChecked] = useState({});
  const [showNotebook, setShowNotebook] = useState(false);
  const [notes, setNotes] = useState('');

  const userId = 'exampleUserId'; // Replace with dynamic user ID when available

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
          setPageNumber(progressData.page || 1);
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

  // Handle successful document load
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Save progress to Firebase
  const saveProgressToFirebase = (page) => {
    const progress = numPages ? (page / numPages) * 100 : 0;

    set(ref(db, `users/${userId}/progress`), {
      page,
      progress,
      timestamp: Date.now(),
    })
      .then(() => console.log('Progress saved successfully!'))
      .catch((error) => console.error('Error saving progress:', error));
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
    saveProgressToFirebase(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  // Toggle bookmark state
  const handleStarClick = () => {
    const updatedStars = { ...starChecked, [pageNumber]: !starChecked[pageNumber] };
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
    set(ref(db, `users/${userId}/notes`), { notes })
      .then(() => {
        console.log('Notes saved successfully!');
        toggleNotebook(); // Close notebook after saving
      })
      .catch((error) => console.error('Error saving notes:', error));
  };

  // Calculate reading progress percentage
  const progress = numPages ? (pageNumber / numPages) * 100 : 0;

  return (
    <div className="book-container">
      {/* Header with settings and notebook button */}
      <header className="giver-header">
        <h1 className="giver-title">The Giver</h1>
        <div className="giver-buttons">
          <button className="btn-icon" aria-label="Settings">
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
              checked={starChecked[pageNumber] || false}
              onChange={handleStarClick}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" className="star-icon">
              <path
                d="M12 .587l3.668 7.431 8.184 1.19-5.91 5.65 1.394 8.146L12 18.897l-7.335 3.85 1.394-8.146-5.910-5.65 8.184-1.19z"
                fill={starChecked[pageNumber] ? 'orange' : 'none'}
              />
            </svg>
          </label>
        </div>
      </header>

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

      {/* PDF document display */}
      <div className="book-border">
        <Document file={`${process.env.PUBLIC_URL}/book/newbook.pdf`} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={1.2} />
        </Document>
      </div>

      <p className="page-number">
        Page {pageNumber} of {numPages}
      </p>

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Page Navigation */}
      <div className="page-navigation">
        <button
          className="arrow-btn left-arrow"
          aria-label="Previous Page"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          <img src={`${process.env.PUBLIC_URL}/book/book_images/left-arrow.png`} alt="Left Arrow" />
        </button>

        <button
          className="arrow-btn right-arrow"
          aria-label="Next Page"
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === numPages}
        >
          <img src={`${process.env.PUBLIC_URL}/book/book_images/right-arrow.png`} alt="Right Arrow" />
        </button>
      </div>
    </div>
  );
};

export default Book;
