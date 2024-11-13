import React, { useState} from 'react'
import '../index.css';
import Book from './Book';

const Quiz = () => {
  // Stores answers to all questions 
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // added questions but I can add more later, once the book is imported 
  const questions = [
    {
      id: 1,
      text: 'Who is the main character?',
      options: ['A) Jonas', 'B) Fiona', 'C) Gabriel', 'D) Lily', 'E) Asher'],
    },
    {
      id: 2,
      text: 'What is the color of the sky?',
      options: ['A) Blue', 'B) Green', 'C) Red', 'D) Yellow', 'E) Purple'],
    },
    
  ];
  // To get the index of the the questiions 
  const currentQ = questions[currentQuestion];
  // Changes the answer of the questions, stores updated answers in the array
  const handleAnswerChange = (event) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = event.target.value;
    setSelectedAnswers(updatedAnswers);
  };
  // This is what happens when you sumbit page from reloading 
    const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`You selected: ${selectedAnswers[currentQuestion]}`);;
  };
  // Able to go to next question if the question is not the last index
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Able to go to the previous question if it is not the first question 
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <div>
      <div className="main-container">
        <div className="quiz-pdf-container">
          <Book />
        </div>

        <div className="quiz-container">
          <h1>Quiz</h1>
          <form id="quiz-questions" onSubmit={handleSubmit}>
            <div className="question">
              <label id="questions">{currentQ.text}</label><br />
              {currentQ.options.map((option, index) => {
                // Identifies the letter for the option, example A) Smith, it would take smith
                const answerLetter = option.charAt(0); 

                return (
                  <div key={index}>
                    <input
                      type="radio"
                      name="question"
                      // Set the answer value to the letter option
                      value={answerLetter}
                      // Check if this option is selected
                      checked={selectedAnswers[currentQuestion] === answerLetter}
                      // Handles changing answers
                      onChange={handleAnswerChange} 
                    />
                    {/* Display the option text (e.g., "A) Jonas") */}
                    {option} 
                    <br />
                  </div>
                );
              })
              }
            </div>
            <button type="submit" id="submit-button">Submit</button>

            <div className="button-container">
              <button type="button" id="back-button" onClick={handleBack}>Back</button>
              <button type="button" id="next-button" onClick={handleNext}>Next</button>
            </div>
          </form>

          <div className="selected-answer">
            {selectedAnswers[currentQuestion] && (
              <p>Your selected answer: {selectedAnswers[currentQuestion]}</p>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};
export default Quiz;