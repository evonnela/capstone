import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../index';
import { Link } from 'react-router-dom';
import '../index.css';
import ProgressBar from './ProgressBar';
import backArrow from '../img/backArrow.png';
import { createPortal } from 'react-dom';

const ArrowPortal = () => {
  const target = document.getElementById('fixed-ui');
  if (!target) return null;

  return createPortal(
    <div style={{ position: 'fixed', top: '170px', left: '20px', zIndex: 9999 }}>
      <Link to="/">
        <img
          src={backArrow}
          alt="Back"
          style={{ width: '30px', height: '30px' }}
          className="btn-icon"
        />
      </Link>
    </div>,
    target
  );
};


const Book = ({ onPageChange, canNavigate }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [starChecked, setStarChecked] = useState({});
  const [showNotebook, setShowNotebook] = useState(false);
  const [notes, setNotes] = useState('');
  const [fontSize, setFontSize] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [chapterIndices, setChapterIndices] = useState([]);

  const bookBorderRef = useRef(null);
  const measureRef = useRef(null);
  const contentContainerRef = useRef(null);

  const userId = localStorage.getItem('user') || 'exampleUserId';
  const bookUrl = `${process.env.PUBLIC_URL}/book/thegiver.json`;

  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentChapter, currentPage]);

  const calculatePages = useCallback((content, containerHeight, currentFirstParagraph = 0) => {
    if (!content || !containerHeight) return [];

    if (!measureRef.current) {
      measureRef.current = document.createElement('div');
      measureRef.current.style.position = 'absolute';
      measureRef.current.style.visibility = 'hidden';
      measureRef.current.style.width = 'calc(100% - 40px)';
      measureRef.current.style.fontSize = `${fontSize}%`;
      measureRef.current.style.padding = '0 20px';
      measureRef.current.style.lineHeight = '1.6';
      document.body.appendChild(measureRef.current);
    }

    measureRef.current.innerHTML = '<h2>Chapter Title</h2>';
    const titleHeight = measureRef.current.offsetHeight;
    const availableHeight = containerHeight - titleHeight - 40;

    const paragraphs = content.split('\n\n');
    const pages = [];
    let currentPageContent = '';
    let currentHeight = 0;
    let currentParaIndex = currentFirstParagraph;

    const measureText = (text) => {
      measureRef.current.innerHTML = text;
      return measureRef.current.offsetHeight;
    };

    while (currentParaIndex < paragraphs.length) {
      const paraHTML = `<p>${paragraphs[currentParaIndex]}</p>`;
      const paraHeight = measureText(paraHTML);

      if (currentHeight + paraHeight > availableHeight) {
        if (currentPageContent) {
          pages.push({
            content: currentPageContent,
            firstParagraph: currentFirstParagraph,
            lastParagraph: currentParaIndex - 1
          });
          currentFirstParagraph = currentParaIndex;
          currentPageContent = '';
          currentHeight = 0;
        }

        if (paraHeight > availableHeight) {
          const words = paragraphs[currentParaIndex].split(' ');
          let partialContent = '';
          for (const word of words) {
            const testContent = partialContent + word + ' ';
            const testHeight = measureText(`<p>${testContent.trim()}</p>`);
            if (testHeight <= availableHeight) {
              partialContent = testContent;
            } else {
              if (partialContent) {
                pages.push({
                  content: `<p>${partialContent.trim()}</p>`,
                  firstParagraph: currentParaIndex,
                  lastParagraph: currentParaIndex
                });
              }
              partialContent = word + ' ';
            }
          }

          if (partialContent) {
            pages.push({
              content: `<p>${partialContent.trim()}</p>`,
              firstParagraph: currentParaIndex,
              lastParagraph: currentParaIndex
            });
          }

          currentParaIndex++;
          continue;
        }
      }

      currentPageContent += paraHTML;
      currentHeight += paraHeight;
      currentParaIndex++;
    }

    if (currentPageContent) {
      pages.push({
        content: currentPageContent,
        firstParagraph: currentFirstParagraph,
        lastParagraph: paragraphs.length - 1
      });
    }

    return pages;
  }, [fontSize]);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  useEffect(() => {
    const handleResize = () => {
      if (
        chapters.length === 0 ||
        !bookBorderRef.current ||
        !pages[currentChapter] ||
        !pages[currentChapter][currentPage]
      ) return;

      const firstParaIndex = pages[currentChapter][currentPage].firstParagraph;

      const containerHeight = bookBorderRef.current.offsetHeight;
      const allPages = [];
      let totalPagesCount = 0;

      chapters.forEach((chapter) => {
        const chapterPages = calculatePages(chapter.content, containerHeight);
        allPages.push(chapterPages);
        totalPagesCount += chapterPages.length;
      });

      setPages(allPages);
      setTotalPages(totalPagesCount);

      const newPageIndex = allPages[currentChapter].findIndex(
        (page) =>
          firstParaIndex >= page.firstParagraph &&
          firstParaIndex <= page.lastParagraph
      );

      if (newPageIndex !== -1) {
        setCurrentPage(newPageIndex);
      }
    };

    const debouncedResize = debounce(handleResize, 300);
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [chapters, fontSize, calculatePages, currentChapter, currentPage, pages]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(bookUrl);
        if (!response.ok) throw new Error('Failed to load book');
        const data = await response.json();

        const indices = data.reduce((acc, item, index) => {
          if (item.info?.startsWith('Chapter') && item.content.trim().length > 10) {
            acc.push(index);
          }
          return acc;
        }, []);

        setChapterIndices(indices);
        setChapters(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookUrl]);

  useEffect(() => {
    if (chapters.length === 0 || !bookBorderRef.current) return;
    const containerHeight = bookBorderRef.current.offsetHeight;
    const allPages = [];
    let total = 0;

    chapters.forEach((chapter) => {
      const chapterPages = calculatePages(chapter.content, containerHeight);
      allPages.push(chapterPages);
      total += chapterPages.length;
    });

    setPages(allPages);
    setTotalPages(total);
  }, [chapters, calculatePages]);

  const handlePageChange = (direction) => {
    if (!pages[currentChapter] || (!canNavigate && direction === 'next')) return;
    let newChapter = currentChapter;
    let newPage = currentPage;

    if (direction === 'next') {
      if (currentPage < pages[currentChapter].length - 1) {
        newPage++;
      } else if (currentChapter < chapters.length - 1) {
        newChapter++;
        newPage = 0;
      } else return;
    } else {
      if (currentPage > 0) {
        newPage--;
      } else if (currentChapter > 0) {
        newChapter--;
        newPage = pages[newChapter].length - 1;
      } else return;
    }

    setCurrentChapter(newChapter);
    setCurrentPage(newPage);

    let pagesRead = 0;
    for (let i = 0; i < newChapter; i++) pagesRead += pages[i]?.length || 0;
    pagesRead += newPage + 1;
    const newProgress = Math.floor((pagesRead / totalPages)) * 100;

    setProgress(newProgress);
    saveProgressToFirebase(newChapter, newPage, newProgress);

    const isLastPage = newPage === pages[newChapter].length - 1 && chapterIndices.includes(newChapter);
    onPageChange(newChapter, newPage, isLastPage, chapterIndices);
  };

  const saveProgressToFirebase = (chapter, page, progress) => {
    set(ref(db, `users/${userId}/progress`), {
      chapter, page, progress, timestamp: Date.now()
    }).catch(console.error);
  };

  const toggleNotebook = () => setShowNotebook(prev => !prev);

  const handleStarClick = () => {
    const updated = { ...starChecked, [currentChapter]: !starChecked[currentChapter] };
    setStarChecked(updated);
    set(ref(db, `users/${userId}/bookmarks`), updated).catch(console.error);
  };

  const handleSaveNotes = () => {
    set(ref(db, `users/${userId}/notes`), notes)
      .then(toggleNotebook)
      .catch(console.error);
  };

  const getChapterTitle = (index) => {
    const chapter = chapters[index];
    return chapter?.info || (chapter?.title?.trim() ? `Chapter ${index + 1}` : '');
  };

  useEffect(() => {
    return () => {
      if (measureRef.current) {
        document.body.removeChild(measureRef.current);
      }
    };
  }, []);

  return (
    <>
    <ArrowPortal />
    <div className="book-container">
      <header className="giver-header">
        <h1 className="giver-title">The Giver</h1>
        <div className="giver-buttons">
          <button className="btn-icon" onClick={() => setShowSettings(!showSettings)}>
            <img src={`${process.env.PUBLIC_URL}/book/book_images/settings.png`} width="25" height="25" alt="settings" />
          </button>
          <button className="btn-icon" onClick={toggleNotebook}>
            <img src={`${process.env.PUBLIC_URL}/book/book_images/notebook.png`} width="25" height="25" alt="notebook" />
          </button>
          <label className="star-label">
            <input type="checkbox" className="star-checkbox" checked={starChecked[currentChapter] || false} onChange={handleStarClick} />
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" className="star-icon">
              <path d="M12 .587l3.668 7.431 8.184 1.19-5.91 5.65 1.394 8.146L12 18.897l-7.335 3.85 1.394-8.146-5.910-5.65 8.184-1.19z" fill={starChecked[currentChapter] ? 'orange' : 'none'} />
            </svg>
          </label>
        </div>
      </header>

      {showSettings && (
        <div className="font-size-settings">
          <button onClick={() => setFontSize(Math.max(50, fontSize - 10))}>-</button>
          <span>Font Size: {fontSize}%</span>
          <button onClick={() => setFontSize(Math.min(150, fontSize + 10))}>+</button>
        </div>
      )}

      {showNotebook && (
        <div className="notebook">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write your notes here..." />
          <button className="save-button" onClick={handleSaveNotes}>Save</button>
        </div>
      )}

      <div className="book-border" ref={bookBorderRef}>
        <div className="content-container" ref={contentContainerRef} style={{ fontSize: `${fontSize}%`, height: "100%", overflowY: "auto", padding: "20px" }}>
          {loading ? (
            <div className="loading">Loading book...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : pages[currentChapter]?.[currentPage] ? (
            <div className="chapter-content" key={`${currentChapter}-${currentPage}`}>
              <h2>{getChapterTitle(currentChapter)}</h2>
              <div className="page-content" dangerouslySetInnerHTML={{ __html: pages[currentChapter][currentPage].content.replace(/\n/g, '<br />') }} />
            </div>
          ) : (
            <div>No content available</div>
          )}
        </div>
      </div>

      <ProgressBar progress={progress} />

      <div className="page-navigation">
        <button className="arrow-btn left-arrow" onClick={() => handlePageChange('prev')} disabled={currentChapter === 0 && currentPage === 0}>
          <img src={`${process.env.PUBLIC_URL}/book/book_images/left-arrow.png`} alt="Previous" />
        </button>

        <span className="chapter-info">
          {getChapterTitle(currentChapter) || `Chapter ${currentChapter + 1}`} - Page {currentPage + 1} of {pages[currentChapter]?.length || 1}
        </span>

        <button className="arrow-btn right-arrow" onClick={() => handlePageChange('next')} disabled={(currentChapter === chapters.length - 1 && currentPage === (pages[currentChapter]?.length || 1) - 1) || !canNavigate}>
          <img src={`${process.env.PUBLIC_URL}/book/book_images/right-arrow.png`} alt="Next" />
        </button>
      </div>
    </div>
    </>
  );
};

export default Book;