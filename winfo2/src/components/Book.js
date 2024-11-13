import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import "react-pdf-highlighter/dist/style.css";
import ProgressBar from './ProgressBar';

const Book = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [starChecked, setStarChecked] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToNextPage() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }

  function handleStarClick() {
    setStarChecked(!starChecked);
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
          <button className="btn-icon" aria-label="Notebook">
            <img src="/book/book_images/notebook.png" width="25" height="25" alt="notebook" />
          </button>
          <label htmlFor="star" className="star-label" aria-label="Bookmark">
            <input
              type="checkbox"
              id="star"
              className="star-checkbox"
              checked={starChecked}
              onChange={handleStarClick}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" className="star-icon">
              <path
                d="M12 .587l3.668 7.431 8.184 1.19-5.91 5.65 1.394 8.146L12 18.897l-7.335 3.85 1.394-8.146-5.91-5.65 8.184-1.19z"
                fill={starChecked ? 'yellow' : 'none'}
              />
            </svg>
          </label>
        </div>
      </header>

      <div className="book-border">
        <Document file="book.pdf" onLoadSuccess={onDocumentLoadSuccess}>
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
          onClick={goToPreviousPage}
          disabled={pageNumber === 1}
        >
          <img src="/book/book_images/left-arrow.png" alt="Left Arrow" />
        </button>

        <button
          className="arrow-btn right-arrow"
          aria-label="Next Page"
          onClick={goToNextPage}
          disabled={pageNumber === numPages}
        >
          <img src="/book/book_images/right-arrow.png" alt="Right Arrow" />
        </button>
      </div>
    </div>
  );
};

export default Book;