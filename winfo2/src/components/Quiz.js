import React, { useState } from 'react';
import Book from './Book';
import '../index.css';

const Quiz = () => {
  // Store answers and current question index
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [score, setScore] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState([]); // Track submission status for each question

  // Define quiz questions, tied to page numbers
  const quizData = [
    {
      pageNumber: 10,  // Quiz for page 10
      questions: [
        { id: 1, text: 'What happened on page 8?', options: ['A) Event 1', 'B) Event 2', 'C) Event 3'], correctAnswer: 'A'},
        { id: 2, text: 'Who is Jonas?', options: ['A) Character 1', 'B) Character 2', 'C) Character 3'], correctAnswer: 'B' },
        // Additional questions for this page
      ],
    },
    {
      pageNumber: 15,  // Quiz for page 15
      questions: [
        { id: 1, text: 'What is the color of the sky?', options: ['A) Blue', 'B) Green', 'C) Red'] },
        { id: 2, text: 'Where does the story take place?', options: ['A) Location 1', 'B) Location 2', 'C) Location 3'] },
        // More questions here
      ],
    },
  ];

  // Get the quiz for the current page
  const currentQuiz = quizData.find((quiz) => quiz.pageNumber === currentPage);
  const currentQ = currentQuiz ? currentQuiz.questions[currentQuestion] : null;

  // Handle answer change
  const handleAnswerChange = (event) => {
    if (submittedQuestions[currentQuestion]) return; // Prevent changing the answer if already submitted

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = event.target.value;
    setSelectedAnswers(updatedAnswers);
  };
  // Handle submit
  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure the user can only submit once for a question
    if (!submittedQuestions[currentQuestion]) {
      // Check if the answer is correct
      if (selectedAnswers[currentQuestion] === currentQ.correctAnswer) {
        setScore(score + 1); // Increment score by 1 if the answer is correct
      }

      const updatedSubmittedQuestions = [...submittedQuestions];
      updatedSubmittedQuestions[currentQuestion] = true; // Mark this question as submitted
      setSubmittedQuestions(updatedSubmittedQuestions); // Update submission state
    }
  };

  // Move to next question
  const handleNext = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Move to previous question
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Page change handler passed to Book.js
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCurrentQuestion(0); // Reset to first question of the new quiz
  };

  return (
    <div className="main-container">
      <div className="quiz-pdf-container">
        <Book onPageChange={handlePageChange} />
      </div>

      <div className={`quiz-container ${!currentQuiz ? 'hidden' : ''}`}>
        {currentQuiz && (
          <>
            <h1>Quiz</h1>
            <form id="quiz-questions" onSubmit={handleSubmit}>
              <div className="question">
                <label>{currentQ.text}</label><br />
                {currentQ.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      name="question"
                      value={option.charAt(0)} // Use the letter (A, B, C, etc.)
                      checked={selectedAnswers[currentQuestion] === option.charAt(0)}
                      onChange={handleAnswerChange}
                      disabled={submittedQuestions[currentQuestion]}
                    />
                    {option}
                  </div>
                ))}
              </div>

              <button type="submit" id="submit-button"  disabled={submittedQuestions[currentQuestion]}>Submit</button>

              <div className="button-container">
                <button className="arrow-btn right-arrow" type="button" id="back-button" onClick={handleBack} disabled={currentQuestion === 0}><img src="/book/book_images/left-arrow.png" alt="Back"/></button>
                
                <button className="arrow-btn left-arrow" type="button" id="next-button" onClick={handleNext} disabled={currentQuestion === currentQuiz.questions.length - 1}><img src="/book/book_images/right-arrow.png" alt="Next"/></button>
              </div>
            </form>
          </>
        )}
      </div>
      <div className="score-display">
        <h2>Your Score: {score}/{currentQuiz ? currentQuiz.questions.length : 0}</h2>
      </div>
    </div>
  );
};

export default Quiz;