import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import '../index.css';
import ProgressBar from './ProgressBar';

const Book = ({ onPageChange }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [starChecked, setStarChecked] = useState({});
  const [showNotebook, setShowNotebook] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const userId = "exampleUserId"; // replace with dynamic user ID when we implement it
    const progressRef = ref(db, `users/${userId}/progress`);
    const bookmarksRef = ref(db, `users/${userId}/bookmarks`);
    const notesRef = ref(db, `users/${userId}/notes`);

    get(progressRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPageNumber(data.page || 1);
        } else {
          console.log("No progress data found.");
        }
      })
      .catch((error) => console.error("Error fetching progress:", error));

    get(bookmarksRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setStarChecked(snapshot.val() || {});
        }
      })
      .catch((error) => console.error("Error fetching bookmarks:", error));

    get(notesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setNotes(snapshot.val() || "");
        }
      })
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function saveProgressToFirebase(page) {
    const userId = "exampleUserId"; // replace with dynamic user ID when we implement it
    const progress = numPages ? (page / numPages) * 100 : 0;

    set(ref(db, `users/${userId}/progress`), {
      page,
      progress,
      timestamp: Date.now(),
    })
      .then(() => console.log("Progress saved successfully!"))
      .catch((error) => console.error("Error saving progress:", error));
  }

  function handlePageChange(page) {
    setPageNumber(page);
    saveProgressToFirebase(page);
    if (onPageChange) {
      onPageChange(page);
    }
  }

  function handleStarClick() {
    const updatedStars = {
      ...starChecked,
      [pageNumber]: !starChecked[pageNumber],
    };
    setStarChecked(updatedStars);

    const userId = "exampleUserId"; // replace with dynamic user ID when we implement it
    set(ref(db, `users/${userId}/bookmarks`), updatedStars)
      .then(() => console.log("Bookmark updated successfully!"))
      .catch((error) => console.error("Error saving bookmark:", error));
  }

  function toggleNotebook() {
    setShowNotebook(!showNotebook);
  }

  function handleSave() {
    const userId = "exampleUserId"; // replace with dynamic user ID when we implement it
    set(ref(db, `users/${userId}/notes`), notes)
      .then(() => console.log("Notes saved successfully!"))
      .catch((error) => console.error("Error saving notes:", error));
    toggleNotebook();
  }

  const progress = numPages ? (pageNumber / numPages) * 100 : 0;

  return (
    <div className="book-container">
      <header className="giver-header">
        <h1 className="giver-title">The Giver</h1>
        <div className="giver-buttons">
          <button className="btn-icon" aria-label="Settings">
            <img src="/book/book_images/settings.png" width="25" height="25" alt="settings" />
          </button>
          <button className="btn-icon" aria-label="Notebook" onClick={toggleNotebook}>
            <img src="/book/book_images/notebook.png" width="25" height="25" alt="notebook" />
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
                fill={starChecked[pageNumber] ? 'yellow' : 'none'}
              />
            </svg>
          </label>
        </div>
      </header>

      {showNotebook && (
        <div className="notebook">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
          />
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      )}

      <div className="book-border">
        <Document file={`${process.env.PUBLIC_URL}/book/book.pdf`} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={1.2} />
        </Document>
      </div>

      <p className="page-number">
        Page {pageNumber} of {numPages}
      </p>

      <ProgressBar progress={progress} />

      <div className="page-navigation">
        <button
          className="arrow-btn left-arrow"
          aria-label="Previous Page"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          <img src="/book/book_images/left-arrow.png" alt="Left Arrow" />
        </button>

        <button
          className="arrow-btn right-arrow"
          aria-label="Next Page"
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === numPages}
        >
          <img src="/book/book_images/right-arrow.png" alt="Right Arrow" />
        </button>
      </div>
    </div>
  );
};

export default Book;
