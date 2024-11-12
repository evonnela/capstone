import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const Book = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToNextPage() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }

  return (
    <div>
      <div className="book-border">
        <Document file="fullbook.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button className="turn-page" onClick={goToNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Book;