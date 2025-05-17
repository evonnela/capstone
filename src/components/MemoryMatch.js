import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import asher from '../img/memoryMatchImg/asher.png';
import fiona from '../img/memoryMatchImg/fiona.png';
import gabriel from '../img/memoryMatchImg/gabriel.png';
import jonas from '../img/memoryMatchImg/jonas.png';
import jonasFather from '../img/memoryMatchImg/jonasFather.png';
import jonasMother from '../img/memoryMatchImg/jonasMother.png';
import katharine from '../img/memoryMatchImg/katharine.png';
import larissa from '../img/memoryMatchImg/larissa.png';
import lily from '../img/memoryMatchImg/lily.png';
import rosemary from '../img/memoryMatchImg/rosemary.png';
import theChiefElder from '../img/memoryMatchImg/theChiefElder.png';
import theGiver from '../img/memoryMatchImg/theGiver.png';
import cardBack from '../img/memoryMatchImg/cardBack.png';
import backArrow from '../img/backArrow.png';

export default function MemoryMatch() {
  const [time, setTime] = useState(0); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [level, setLevel] = useState("easy");
  const [isGameOver, setIsGameOver] = useState(false);
  const [endTime, setEndTime] = useState(0);

  const imgCards = [asher, fiona, gabriel, jonas, jonasFather, jonasMother, 
    katharine, larissa, lily, rosemary, theChiefElder, theGiver];

  const levels = {
    easy: 12,
    medium: 20,
    hard: 24,
  };

  useEffect(() => {
    resetGame();
  }, [level]);

  const resetGame = () => {
    const numCards = levels[level];
    const shuffledimgCards = imgCards.sort(() => Math.random() - 0.5);
    const selectedImages = shuffledimgCards.slice(0, numCards / 2);
    const shuffledImages = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((src, index) => ({ id: index, src, isFlipped: false }));

    setCards(shuffledImages);
    setFlippedCards([]);
    setMatchedCards([]);
    setTime(0);
    setIsTimerRunning(false);
    setIsGameOver(false);
    setEndTime(0);
  };

  useEffect(() => {
    let timerInterval;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isTimerRunning && time !== 0) {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning]);

  const handleCardClick = (cardId) => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    const clickedCard = cards.find((card) => card.id === cardId);
    if (clickedCard.isFlipped || flippedCards.length === 2) return;

    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    setFlippedCards((prev) => [...prev, cardId]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard.src === secondCard.src) {
        setMatchedCards((prev) => [...prev, firstCardId, secondCardId]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setIsTimerRunning(false);
      setIsGameOver(true);
      setEndTime(time);
    }
  }, [matchedCards, cards, time, level]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const maxColumns = level === 'easy' ? 4 : level === 'medium' ? 5 : 6;

  return (
    <>
      <Link to="/Games"><img src={backArrow} width={35} style={{paddingTop: '15px', paddingLeft: '20px'}} className="btn-icon"/></Link>
      <div style={{textAlign: 'center'}}>
        <header>
          <h1>Memory Match</h1>
          <p style={{ maxWidth: '600px', margin: '10px auto', fontSize: '16px', color: '#444' }}>
            Click on a card to flip it over and start the timer. Try to find all the matching pairs in as 
            little time as possible!
          </p>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }} >
              {["easy", "medium", "hard"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  style={{
                    margin: '0 5px',
                    padding: '10px 20px',
                    backgroundColor: level === lvl ? '#FE6F61' : '#e0e0e0',
                    color: level === lvl ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontFamily:'Comic Sans MS, sans-serif'
                  }}
                  className="btn-icon"
                >
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>
            <p>Time - {formatTime(time)}</p>
          </div>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
            gap: '10px',
            justifyContent: 'center',
            margin: '0 auto',
            maxWidth: `${maxColumns * 150 + (maxColumns - 1) * 10}px`,
            width: '90vw'
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              style={{
                width: '150px',
                height: '150px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="btn-icon"
            >
              {card.isFlipped || matchedCards.includes(card.id) ? (
                <img src={card.src} alt="Card" style={{ width: '100%', height: '100%' }} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src={cardBack} alt="Back" style={{ width: '80%', height: '80%' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {isGameOver && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                width: '300px',
                textAlign: 'center'
              }}
            >
              <h2>Game Over!</h2>
              <p>You found all the pairs!</p>
              <p>Your Time: {formatTime(endTime)}</p>
              <button
                onClick={resetGame}
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#fe6f61',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'Comic Sans MS, sans-serif'
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
