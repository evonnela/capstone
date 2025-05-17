import { useState } from 'react';
import { Link } from 'react-router-dom';

import backArrow from '../img/backArrow.png';

const words = [
  'jonas', 'gabriel', 'giver', 'memory', 'release', 'sameness',
  'receiver', 'ceremony', 'community', 'rules', 'assignment',
  'stirrings', 'discipline', 'dwelling', 'sled', 'river',
  'freedom', 'emotion', 'elders', 'pill', 'choice'
];
const wordHints = {
  jonas: "Main character of *The Giver*",
  gabriel: "Baby cared for by Jonas",
  giver: "The one who holds all memories",
  memory: "Something Jonas receives",
  release: "A euphemism for death in the story",
  sameness: "A concept used to eliminate differences",
  receiver: "Jonas's new role",
  ceremony: "Annual event where roles are assigned",
  community: "Where Jonas lives",
  rules: "Strict guidelines for behavior",
  assignment: "Given at age twelve",
  stirrings: "Feelings that require pills",
  discipline: "Enforced for rule-breaking",
  dwelling: "Where Jonas lives",
  sled: "Used in Jonas’s first memory",
  river: "Boundary of the community",
  freedom: "What Jonas gains by leaving",
  emotion: "Suppressed in society",
  elders: "Leaders of the community",
  pill: "Taken to suppress stirrings",
  choice: "Taken away from the community"
};

const maxWrong = 6;

const Angryman = () => {
  const [word, setWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || wrongGuesses.includes(letter) || gameOver) return;

    if (word.includes(letter)) {
      const updated = [...guessedLetters, letter];
      setGuessedLetters(updated);

      // Check for win
      if (word.split('').every(l => updated.includes(l))) {
        setGameWon(true);
        setStreak(streak + 1);
      }
    } else {
      const updatedWrong = [...wrongGuesses, letter];
      setWrongGuesses(updatedWrong);

      if (updatedWrong.length >= maxWrong) {
        setGameOver(true);
        setStreak(0);
      }
    }
  };

  const renderWord = () =>
    word.split('').map((letter, i) => (
      <span key={i} style={{ marginRight: '5px', fontSize: '24px' }}>
        {guessedLetters.includes(letter) || gameOver ? letter : '_'}
      </span>
    ));

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const renderAngryFace = () => {
    const partsShown = wrongGuesses.length;
  
    // Redder with more wrong guesses
    const redIntensity = 255;
    const greenBlue = 255 - partsShown * 40;
    const faceColor = `rgb(${redIntensity}, ${Math.max(greenBlue, 50)}, ${Math.max(greenBlue, 50)})`;
  
    return (
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: faceColor,
          margin: '0 auto',
          border: '4px solid #000',
          transition: 'background 0.3s ease'
        }}
      >
        {/* Left eyebrow */}
        {partsShown >= 1 && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '40px',
            height: '8px',
            backgroundColor: 'black',
            transform: 'rotate(30deg)'
          }} />
        )}
  
        {/* Right eyebrow */}
        {partsShown >= 2 && (
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '40px',
            height: '8px',
            backgroundColor: 'black',
            transform: 'rotate(-30deg)'
          }} />
        )}
  
        {/* Left eye */}
        {partsShown >= 3 && (
          <div style={{
            position: 'absolute',
            top: '70px',
            left: '55px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'black'
          }} />
        )}
  
        {/* Right eye */}
        {partsShown >= 4 && (
          <div style={{
            position: 'absolute',
            top: '70px',
            right: '55px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'black'
          }} />
        )}
        {/* Nose */}
        {partsShown >= 5 && (
        <div style={{
            position: 'absolute',
            top: '95px',
            left: '50%',
            width: '8px',
            height: '25px',
            backgroundColor: 'black',
            borderRadius: '4px',
            transform: 'translateX(-50%)'
        }} />
        )}


        {/* Angry mouth */}
        {partsShown >= 6 && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            width: '60px',
            height: '30px',
            border: '4px solid black',
            borderTop: 'none',
            borderRadius: '0 0 50px 50px',
            transform: 'translateX(-50%) rotate(180deg)'
          }} />
        )}
      </div>
    );
  };  
  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <>
      <Link to="/Games"><img src={backArrow} width={35} style={{paddingTop: '15px', paddingLeft: '20px'}} className="btn-icon"/></Link>
      <div style={{ textAlign: 'center'}}>
        <h1>😡 Angryman Game</h1>

        <p style={{ maxWidth: '600px', margin: '10px auto', fontSize: '16px', color: '#444' }}>
          Guess the hidden word letter by letter! You have {maxWrong} chances before the angry face is complete.
          Click the letters below to make a guess. Use the hint to help you figure it out!
        </p>

        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          🔥 Streak: {streak}
        </div>

        <div style={{ fontSize: '60px', margin: '20px 0' }}>
          {renderAngryFace()}
        </div>

        <div style={{ fontSize: '30px', marginBottom: '20px' }}>
          {renderWord()}
        </div>

        {!gameOver && !gameWon && (
          <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '20px' }}>
          Hint: {wordHints[word]}
          </p>
        )}

        {gameOver && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            Game Over! The word was: <span style={{ textTransform: 'uppercase' }}>{word}</span>
          </p>
        )}

        {gameWon && (
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            🎉 You guessed the word!
          </p>
        )}

        {(gameOver || gameWon) && (
          <button
            onClick={resetGame}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Comic Sans MS, sans-serif'
            }}
          >
            Play Again
          </button>
        )}


        <div style={{ marginTop: '20px' }}>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={
                guessedLetters.includes(letter) ||
                wrongGuesses.includes(letter) ||
                gameOver ||
                gameWon
              }
              style={{ margin: '4px', padding: '8px', fontSize: '16px', fontFamily: 'Comic Sans MS, sans-serif' }}
            >
              {letter}
            </button>
          ))}
        </div>

        <p style={{ marginTop: '10px' }}>
          Wrong guesses ({wrongGuesses.length}/{maxWrong}): {wrongGuesses.join(', ')}
        </p>
      </div>
    </>
  );
};

export default Angryman;
