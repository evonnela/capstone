import React, { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import Book from './Book';
import '../index.css';

const Quiz = () => {

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [score, setScore] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set()); 
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const userId = "exampleUserId"; // need to find a way to get a user ID
  const quizDataRef = ref(db, `users/${userId}/quizData`);

 
  const quizData = [
    {
      pageNumber: 4,  
      questions: [
        { id: 1, text: 'What caused Jonas to feel frightened and stay indoors?', options: ['A) A thunderstorm was approaching.', 
          'B) The community ordered everyone to stay inside due to a pilots mistake ', 
          'C) There was a fire in the community.'], correctAnswer: 'B'}
      ]
    },
    {
      pageNumber: 6,  
      questions: [
        { id: 2, text: "Why was Jonas's father worried about the newchild?", 
          options: ['A) The newchild was frequently breaking rules.',
           'B) The newchild was not growing well and had trouble sleeping.', 
           'C) The newchild was misbehaving and causing problems in the community.'],
           correctAnswer: 'B' }
      ],
    },
    {
      pageNumber: 7,  
      questions: [
        { id: 3, text: "Why does Jonas feel apprehensive in this scene?", 
          options: ["A) He is worried about his father's job in the night crew.",
           'B) He is nervous about the upcoming Ceremony of Twelve.', 
           'C) He is concerned about the punishment of the repeat offender.'],
           correctAnswer: 'B' }
      ],
    },
    {
      pageNumber: 9,  
      questions: [
        { id: 4, text: "What does Jonas’s father reveal about breaking a rule? ", 
          options: ['A) He broke a rule by looking at the Naming list early to see the newchild’s name.',
           'B) He broke a rule by secretly teaching Lily how to ride a bicycle.', 
           'C) He broke a rule by giving a newchild a name before the Naming ceremony.'],
           correctAnswer: 'A' }
      ],
    },
    {
      pageNumber: 11, 
      questions: [
        { id: 5, text: "What does Jonas's mother warn him about regarding the Ceremony of Twelve?", 
          options: ['A) Jonas will be separated from his family after the Ceremony.',
           'B) He will have to start taking adult responsibilities immediately after the Ceremony.', 
           'C) After the Ceremony of Twelve, he will be moved to a new group with other people based on his Assignment.'],
           correctAnswer: 'C' }
      ],
    },
    {
      pageNumber: 12,  
      questions: [
        { id: 6, text: "What does Jonas’s mother say about the changes after the Ceremony of Twelve?", 
          options: ['A) He will no longer have to do any schoolwork or assignments.',
           'B) He will be separated from his friends and move into a new group, but will make new friends who share his interests.', 
           'C) He will be able to continue playing games and doing recreation activities after the Ceremony.'],
           correctAnswer: 'B' }
      ],
    },
    {
      pageNumber: 13,  
      questions: [
        { id: 7, text: "What makes Jonas feel self-conscious when he looks at the newchild?", 
          options: ['A) The newchild’s eyes are pale like his own.',
           'B) The newchild is wearing a comfort object that is different from his own.', 
           'C) The newchild is smiling at him in a strange way.'],
           correctAnswer: 'A' }
      ],
    },
    {
      pageNumber: 14,  
      questions: [
        { id: 8, text: "What does Jonas think would be an appropriate Assignment for Lily?", options: ['A) Birthmother',
           'B) Speaker', 'C) Nurturer'],
           correctAnswer: 'B' }
      ],
    },
    {
      pageNumber: 15,  
      questions: [
        { id: 9, text: "What unusual thing happens when Jonas is playing catch with the apple?", 
          options: ['A) The apple changes shape in mid-air.',
           'B) The apple turns into a different color', 'C) The apple disappears when Jonas catches it'],
           correctAnswer: 'A' }
      ],
    },
  ];

// Load saved quiz data from Firebase

  useEffect(() => {
    get(quizDataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const savedData = snapshot.val();
          setSelectedAnswers(savedData.selectedAnswers || {});
          setCurrentPage(savedData.currentPage || 1);
          setScore(savedData.score || 0);
          setSubmittedQuestions(new Set(savedData.submittedQuestions || []));
        }
      })
      .catch((error) => console.error("Error loading quiz data:", error));
  }, []);

    // Save quiz progress whenever state changes
  useEffect(() => {
  
    const saveData = {
      selectedAnswers,
      currentPage,
      score,
      submittedQuestions: Array.from(submittedQuestions),
    };

    set(quizDataRef, saveData)
      .catch((error) => console.error("Error saving quiz progress:", error));
  }, [selectedAnswers, currentPage, score, submittedQuestions]);

  const currentQuiz = quizData.find((quiz) => quiz.pageNumber === currentPage);
  const currentQ = currentQuiz ? currentQuiz.questions[0] : null;


  const handleAnswerChange = (event) => {
    if (submittedQuestions.has(currentQ.id)) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: event.target.value,
    }));
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!submittedQuestions.has(currentQ.id)) {
      if (selectedAnswers[currentQ.id] === currentQ.correctAnswer) {
        setScore((prevScore) => prevScore + 1); 
        setFeedbackMessage('Correct');
      } else {
        setFeedbackMessage('Incorrect');
      }
      setSubmittedQuestions((prev) => new Set(prev).add(currentQ.id)); 
    }
  };

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFeedbackMessage('');
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
                      value={option.charAt(0)} 
                      checked={selectedAnswers[currentQ.id] === option.charAt(0)}
                      onChange={handleAnswerChange}
                      disabled={submittedQuestions.has(currentQ.id)}
                    />
                    {option}
                  </div>
                ))}
              </div>

              <button type="submit" id="submit-button"  disabled={submittedQuestions.has(currentQ.id)}>Submit</button>
            </form>
            <div className="feedback-message">
              {feedbackMessage && <p className={feedbackMessage === 'Correct' ? 'correct' : 'incorrect'}>{feedbackMessage}</p>}
            </div>
          </>
        )}
      </div>
      <div className="score-display">
        <h2>Your Score: {score *100} /{quizData.length *100}</h2> 
      </div>
    </div>
  );
};

export default Quiz;