import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import '../index.css';
import ProgressBar from './ProgressBar';

const Book = ({ onLastPageOfChapter }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalChapters, setTotalChapters] = useState(1);
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

  const contentRef = useRef(null);
  const bookBorderRef = useRef(null);
  const measureRef = useRef(null);

  const userId = localStorage.getItem('user') || 'exampleUserId';
  const bookUrl = `${process.env.PUBLIC_URL}/book/thegiver.json`;

  const getChapterTitle = (index) => {
    const chapter = chapters[index];
    if (!chapter || chapter.title.trim() === '') return '';
    return chapter.info || `Chapter ${index + 1}`;
  };  

  const calculatePages = useCallback((content, containerHeight) => {
    if (!content || !containerHeight || containerHeight === 0) return [];

    if (!measureRef.current) {
      measureRef.current = document.createElement('div');
      measureRef.current.style.position = 'absolute';
      measureRef.current.style.visibility = 'hidden';
      measureRef.current.style.width = `${bookBorderRef.current.offsetWidth - 40}px`;
      measureRef.current.style.fontSize = `${fontSize}%`;
      measureRef.current.style.padding = '0 20px';
      measureRef.current.style.lineHeight = '1.6';
      measureRef.current.style.whiteSpace = 'normal';
      measureRef.current.style.wordWrap = 'break-word';
      measureRef.current.style.hyphens = 'auto';
      document.body.appendChild(measureRef.current);
    }

    measureRef.current.style.fontSize = `${fontSize}%`;
    measureRef.current.style.width = `${bookBorderRef.current.offsetWidth - 40}px`;

    measureRef.current.innerHTML = '<h2>Chapter Title</h2><div style="height: 20px;"></div>';
    const fixedElementsHeight = measureRef.current.offsetHeight;
    const maxContentHeight = containerHeight + 50;

    const paragraphs = content.split('\n\n');
    const pages = [];
    let currentPageContent = '';
    let currentHeight = 0;

    const measureParagraph = (html) => {
      measureRef.current.innerHTML = html;
      return measureRef.current.offsetHeight;
    };

    for (let paragraph of paragraphs) {
      const paraHTML = `<p>${paragraph}</p>`;
      const paraHeight = measureParagraph(paraHTML);

      if (currentHeight + paraHeight <= maxContentHeight) {
        currentPageContent += paraHTML;
        currentHeight += paraHeight;
      } else {
        if (paraHeight > maxContentHeight) {
          const words = paragraph.split(' ');
          let partial = '';
          for (let i = 0; i < words.length; i++) {
            let testHTML = `<p>${partial + words[i]} </p>`;
            let testHeight = measureParagraph(testHTML);
            if (currentHeight + testHeight <= maxContentHeight) {
              partial += words[i] + ' ';
              currentHeight = currentHeight + testHeight;
            } else {
              if (partial.trim()) {
                pages.push(currentPageContent + `<p>${partial.trim()}</p>`);
                currentPageContent = '';
                currentHeight = 0;
              }
              partial = words[i] + ' ';
            }
          }
          if (partial.trim()) {
            currentPageContent += `<p>${partial.trim()}</p>`;
            currentHeight = measureParagraph(`<p>${partial.trim()}</p>`);
          }
        } else {
          if (currentPageContent) pages.push(currentPageContent);
          currentPageContent = paraHTML;
          currentHeight = paraHeight;
        }
      }
    }

    if (currentPageContent) {
      pages.push(currentPageContent);
    }

    return pages;
  }, [fontSize]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(bookUrl);
        if (!response.ok) throw new Error('Failed to load book');
        const data = await response.json();
        
        if (!Array.isArray(data)) throw new Error('Invalid book format');
        
        // Identify which indices are actual chapters (not dedication/author info)
        const chapterIndices = data.reduce((acc, item, index) => {
          if (item.info && item.info.startsWith('Chapter') && item.content.trim().length > 10) {
            acc.push(index);
          }
          return acc;
        }, []);
        
        setChapterIndices(chapterIndices);
        setChapters(data);
        setTotalChapters(chapterIndices.length);
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

    const containerHeight = bookBorderRef.current.clientHeight;
    const allPages = [];
    let totalPagesCount = 0;

    chapters.forEach(chapter => {
      const chapterPages = calculatePages(chapter.content, containerHeight);
      allPages.push(chapterPages);
      totalPagesCount += chapterPages.length;
    });

    setPages(allPages);
    setTotalPages(totalPagesCount);
  }, [chapters, fontSize, calculatePages]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const progressRef = ref(db, `users/${userId}/progress`);
        const bookmarksRef = ref(db, `users/${userId}/bookmarks`);
        const notesRef = ref(db, `users/${userId}/notes`);

        const [progressSnapshot, bookmarksSnapshot, notesSnapshot] = await Promise.all([
          get(progressRef),
          get(bookmarksRef),
          get(notesRef)
        ]);

        if (progressSnapshot.exists()) {
          const progressData = progressSnapshot.val();
          setCurrentChapter(progressData.chapter || 0);
          setCurrentPage(progressData.page || 0);
          setProgress(progressData.progress || 0);
        }

        if (bookmarksSnapshot.exists()) {
          setStarChecked(bookmarksSnapshot.val() || {});
        }

        if (notesSnapshot.exists()) {
          setNotes(notesSnapshot.val() || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const saveProgressToFirebase = (chapter, page, calculatedProgress) => {
    set(ref(db, `users/${userId}/progress`), {
      chapter,
      page,
      progress: calculatedProgress,
      timestamp: Date.now(),
    }).catch((error) => console.error('Error saving progress:', error));
  };

  const handlePageChange = (direction) => {
    if (pages.length === 0 || !pages[currentChapter]) return;

    let newChapter = currentChapter;
    let newPage = currentPage;
    
    if (direction === 'next') {
      if (currentPage < pages[currentChapter].length - 1) {
        newPage = currentPage + 1;
      } else if (currentChapter < chapters.length - 1) {
        // Check if this is an actual chapter (not dedication/author info)
        if (chapterIndices.includes(currentChapter) && 
            currentChapter < Math.max(...chapterIndices)) {
          const chapterNumber = chapterIndices.indexOf(currentChapter) + 1;
          onLastPageOfChapter(chapterNumber);
        }
        newChapter = currentChapter + 1;
        newPage = 0;
      } else {
        return;
      }
    } else {
      if (currentPage > 0) {
        newPage = currentPage - 1;
      } else if (currentChapter > 0) {
        newChapter = currentChapter - 1;
        newPage = pages[newChapter].length - 1;
      } else {
        return;
      }
    }

    setCurrentChapter(newChapter);
    setCurrentPage(newPage);
    
    let pagesRead = 0;
    for (let i = 0; i < newChapter; i++) {
      pagesRead += pages[i]?.length || 0;
    }
    pagesRead += newPage + 1;
    
    const calculatedProgress = Math.floor((pagesRead / totalPages) * 100);
    setProgress(calculatedProgress);
    saveProgressToFirebase(newChapter, newPage, calculatedProgress);
  };

  const handleStarClick = () => {
    const updatedStars = { ...starChecked, [currentChapter]: !starChecked[currentChapter] };
    setStarChecked(updatedStars);
    set(ref(db, `users/${userId}/bookmarks`), updatedStars)
      .catch((error) => console.error('Error saving bookmark:', error));
  };

  const toggleNotebook = () => setShowNotebook(prev => !prev);

  const handleSaveNotes = () => {
    set(ref(db, `users/${userId}/notes`), notes)
      .then(toggleNotebook)
      .catch((error) => console.error('Error saving notes:', error));
  };

  const FontSizeSettings = ({ fontSize, changeFontSize }) => (
    <div className="font-size-settings">
      <button onClick={() => changeFontSize(Math.max(50, fontSize - 10))}>-</button>
      <span>Font Size: {fontSize}%</span>
      <button onClick={() => changeFontSize(Math.min(150, fontSize + 10))}>+</button>
    </div>
  );

  useEffect(() => {
    return () => {
      if (measureRef.current) {
        document.body.removeChild(measureRef.current);
      }
    };
  }, []);

  return (
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
            <input
              type="checkbox"
              className="star-checkbox"
              checked={starChecked[currentChapter] || false}
              onChange={handleStarClick}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" className="star-icon">
              <path
                d="M12 .587l3.668 7.431 8.184 1.19-5.91 5.65 1.394 8.146L12 18.897l-7.335 3.85 1.394-8.146-5.910-5.65 8.184-1.19z"
                fill={starChecked[currentChapter] ? 'orange' : 'none'}
              />
            </svg>
          </label>
        </div>
      </header>

      {showSettings && (
        <FontSizeSettings 
          fontSize={fontSize} 
          changeFontSize={setFontSize} 
        />
      )}

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

      <div 
        className="book-border" 
        style={{ height: "70vh", fontSize: `${fontSize}%` }}
        ref={bookBorderRef}
      >
        {loading ? (
          <div className="loading">Loading book...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : pages.length > 0 && pages[currentChapter]?.[currentPage] !== undefined ? (
          <div className="chapter-content">
            <h2>{getChapterTitle(currentChapter)}</h2>
            <div 
              className="page-content"
              dangerouslySetInnerHTML={{ 
                __html: pages[currentChapter][currentPage].replace(/\n/g, '<br />')
              }} 
            />
          </div>
        ) : (
          <div>No content available</div>
        )}
      </div>

      <ProgressBar progress={progress} />

      <div className="page-navigation">
        <button
          className="arrow-btn left-arrow"
          onClick={() => handlePageChange('prev')}
          disabled={currentChapter === 0 && currentPage === 0}
        >
          <img src={`${process.env.PUBLIC_URL}/book/book_images/left-arrow.png`} alt="Previous" />
        </button>

        <span className="chapter-info">
          {(chapters[currentChapter]?.title.trim() === '' 
            ? chapters[currentChapter]?.info 
            : getChapterTitle(currentChapter)) 
          || `Chapter ${currentChapter + 1}`} 
          - Page {currentPage + 1} of {pages[currentChapter]?.length || 1}
        </span>

        <button
          className="arrow-btn right-arrow"
          onClick={() => handlePageChange('next')}
          disabled={currentChapter === chapters.length - 1 && 
                    currentPage === (pages[currentChapter]?.length || 1) - 1}
        >
          <img src={`${process.env.PUBLIC_URL}/book/book_images/right-arrow.png`} alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default Book;