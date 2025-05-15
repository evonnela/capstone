import { useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../index';
import Book from './Book';
import '../index.css';
import FixedBackArrow from './FixedBackArrow';

const Quiz = ({ setWalletPoints, userId }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizChapter, setCurrentQuizChapter] = useState(null);
  const [score, setScore] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [canNavigate, setCanNavigate] = useState(true);
  const [chapterIndices, setChapterIndices] = useState([]);


  const sanitizedUserId = userId.replace(/[@.]/g, '_');
  const quizDataRef = ref(db, `users/${sanitizedUserId}/quizData`);

  const quizData = [
    {
      chapter: 1,
      question: "What caused Jonas to feel frightened and stay indoors?",
      options: ["A) A thunderstorm was approaching.", "B) The community ordered everyone to stay inside due to a pilot’s mistake.", "C) There was a fire in the community."],
      correctAnswer: "B"
    },
    {
      chapter: 2,
      question: "Why was Asher late to class?",
      options: ["A) He forgot his homework.", "B) He got distracted watching salmon at the hatchery.", "C) His bicycle broke."],
      correctAnswer: "B"
    },
    {
      chapter: 3,
      question: "What rule did Lily break during the play area incident?",
      options: ["A) She took another child’s toy.", "B) She made a fist at a visitor who cut in line.", "C) She refused to share snacks."],
      correctAnswer: "B"
    },
    {
      chapter: 4,
      question: "Where did Jonas do his volunteer hours in this chapter?",
      options: ["A) The Nurturing Center", "B) The House of the Old", "C) The Food Distribution Center"],
      correctAnswer: "B"
    },
    {
      chapter: 5,
      question: "What was Jonas’s dream about?",
      options: ["A) Flying over the community.", "B) Convincing Fiona to bathe in a tub.", "C) Riding a bicycle with Asher."],
      correctAnswer: "B"
    },
    {
      chapter: 6,
      question: "What was special about Gabriel’s situation?",
      options: ["A) He was granted an extra year of nurturing.", "B) He was Jonas’s biological brother.", "C) He could already talk."],
      correctAnswer: "A"
    },
    {
      chapter: 7,
      question: "Why was the audience confused during the Ceremony of Twelve?",
      options: ["A) Jonas was skipped during the Assignments.", "B) The Chief Elder forgot her speech.", "C) Asher refused his Assignment."],
      correctAnswer: "A"
    },
    {
      chapter: 8,
      question: "What was Jonas selected to be?",
      options: ["A) A Nurturer", "B) The Receiver of Memory", "C) A Pilot"],
      correctAnswer: "B"
    },
    {
      chapter: 9,
      question: "Which rule shocked Jonas the most in his instructions?",
      options: ["A) Exemption from rudeness.", "B) Prohibition from dream-telling.", "C) 'You may lie.'"],
      correctAnswer: "C"
    },
    {
      chapter: 10,
      question: "What was the first memory The Giver transmitted to Jonas?",
      options: ["A) Sunshine", "B) Snow and a sled ride", "C) A sunburn"],
      correctAnswer: "B"
    },
    {
      chapter: 11,
      question: "Why did the community eliminate snow and hills?",
      options: ["A) They were dangerous.", "B) They interfered with Sameness and efficiency.", "C) People didn’t like them."],
      correctAnswer: "B"
    },
    {
      chapter: 12,
      question: "What memory did The Giver share with Jonas to teach him about pain?",
      options: ["A) A sunny day at the beach", "B) A sled ride down an icy, steep hill", "C) A birthday party with family"],
      correctAnswer: "B"
    },
    {
      chapter: 13,
      question: "Why did Jonas refuse medication for his training-related pain?",
      options: ["A) He wanted to prove he was brave.", "B) The rules forbade medication for training.", "C) He didn’t trust the medicine."],
      correctAnswer: "B"
    },
    {
      chapter: 14,
      question: "What did Jonas realize about warfare after receiving the memory?",
      options: ["A) It was a game children should play.", "B) It caused terrible suffering and death.", "C) It was necessary for community safety."],
      correctAnswer: "B"
    },
    {
      chapter: 15,
      question: "Why did The Giver apologize after sharing the war memory?",
      options: ["A) He forgot to warn Jonas.", "B) He felt guilty for causing Jonas pain.", "C) He broke a community rule."],
      correctAnswer: "B"
    },
    {
      chapter: 16,
      question: "What was Jonas’s favorite memory from The Giver?",
      options: ["A) A family celebrating with love and colors.", "B) Riding a horse through a field.", "C) A quiet day fishing."],
      correctAnswer: "A"
    },
    {
      chapter: 17,
      question: "How did Jonas react when he saw children playing a war game?",
      options: ["A) He joined in happily.", "B) He was horrified and asked them to stop.", "C) He reported them to the Elders."],
      correctAnswer: "B"
    },
    {
      chapter: 18,
      question: "What happened to the previous Receiver, Rosemary?",
      options: ["A) She escaped the community.", "B) She requested release after painful memories.", "C) She became a Birthmother."],
      correctAnswer: "B"
    },
    {
      chapter: 19,
      question: "What did Jonas discover about 'release'?",
      options: ["A) It was a celebration for the Old.", "B) It meant killing with an injection.", "C) It sent people to another community."],
      correctAnswer: "B"
    },
    {
      chapter: 20,
      question: "Why did Jonas decide to flee the community?",
      options: ["A) He was angry at The Giver.", "B) Gabriel was scheduled for release.", "C) He wanted to find colors."],
      correctAnswer: "B"
    },
    {
      chapter: 21,
      question: "How did Jonas hide from the search planes?",
      options: ["A) He used memories of cold to mask their warmth.", "B) He buried himself in snow.", "C) He rode faster to escape."],
      correctAnswer: "A"
    },
    {
      chapter: 22,
      question: "What danger did Jonas and Gabriel face during their journey?",
      options: ["A) Starvation and harsh weather.", "B) Attacks from wild animals.", "C) Getting lost in a forest."],
      correctAnswer: "A"
    },
    {
      chapter: 23,
      question: "What did Jonas see at the end of his journey?",
      options: ["A) A deserted village.", "B) Lights and music from a welcoming place.", "C) The Giver waiting for him."],
      correctAnswer: "B"
    }
  ];

  useEffect(() => {
    get(quizDataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const savedData = snapshot.val();
          setSelectedAnswers(savedData.selectedAnswers || {});
          setScore(savedData.score || 0);
          setSubmittedQuestions(new Set(savedData.submittedQuestions || []));
        }
      })
      .catch((error) => console.error("Error loading quiz data:", error));
  }, [userId]);

  useEffect(() => {
    const saveData = {
      selectedAnswers,
      score,
      submittedQuestions: Array.from(submittedQuestions),
    };

    set(quizDataRef, saveData)
      .catch((error) => console.error("Error saving quiz progress:", error));
  }, [selectedAnswers, score, submittedQuestions, userId]);

  const getQuizChapterNumber = (chapterIndex, chapterIndices) => {
    return chapterIndices.indexOf(chapterIndex) + 1;
  };

  const handlePageChange = (chapter, page, isLastPageOfChapter, indices) => {
    setChapterIndices(indices); // save for mapping
    const quizChapter = getQuizChapterNumber(chapter, indices);
    const quiz = quizData.find(q => q.chapter === quizChapter);

    if (quiz && isLastPageOfChapter) {
      setCurrentQuizChapter(quizChapter);
      const userAnswer = selectedAnswers[quizChapter];
      const isCorrect = userAnswer === quiz.correctAnswer;

      if (submittedQuestions.has(quizChapter)) {
        setFeedbackMessage(
          isCorrect
            ? 'Correct! +100 points'
            : `Incorrect. The correct answer was ${quiz.correctAnswer}`
        );
        setCanNavigate(true);
      } else {
        setFeedbackMessage('');
        setCanNavigate(false);
      }

      setShowQuiz(true);
    } else {
      setShowQuiz(false);
      setFeedbackMessage('');
      setCanNavigate(true);
    }
  };

  const currentQuiz = quizData.find((quiz) => quiz.chapter === currentQuizChapter);
  const isSubmitted = currentQuiz ? submittedQuestions.has(currentQuiz.chapter) : false;

  const handleAnswerChange = (event) => {
    if (isSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuizChapter]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isSubmitted && currentQuiz) {
      if (selectedAnswers[currentQuizChapter] === currentQuiz.correctAnswer) {
        setScore((prevScore) => prevScore + 1);
        setFeedbackMessage('Correct! +100 points');
        setWalletPoints((prev) => prev + 100);
      } else {
        setFeedbackMessage(`Incorrect. The correct answer was ${currentQuiz.correctAnswer}`);
      }
      setSubmittedQuestions((prev) => new Set(prev).add(currentQuiz.chapter));
      setCanNavigate(true);
    }
  };

  return (
    <>
    <FixedBackArrow />
    <div className="main-container">
      <div className="score-display">
        <h2 className="yourscore">
          Your Score: <span style={{ fontSize: '35px' }}>{score * 100} / {quizData.length * 100}</span>
        </h2>
      </div>

      <div className="content-container">
        <div className="quiz-pdf-container">
          <Book onPageChange={handlePageChange} canNavigate={canNavigate} />
        </div>

        {showQuiz && currentQuiz && (
          <div className="quiz-container active">
            <div className="quiz-header">
                <h4>* Complete the quiz before moving onto the next chapter *</h4>
                <h1>Chapter {currentQuizChapter} Quiz</h1>
            </div>
            <form id="quiz-questions" onSubmit={handleSubmit}>
              <div className="question">
                <label>{currentQuiz.question}</label><br />
                {currentQuiz.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      name="question"
                      value={option.charAt(0)} 
                      checked={selectedAnswers[currentQuizChapter] === option.charAt(0)}
                      onChange={handleAnswerChange}
                      disabled={isSubmitted}
                    />
                    {option}
                  </div>
                ))}
              </div>
              <button 
                type="submit" 
                id="submit-button" 
                disabled={isSubmitted || !selectedAnswers[currentQuizChapter]}
              >
                {isSubmitted ? 'Submitted' : 'Submit'}
              </button>
            </form>
            <div className="feedback-message">
              {feedbackMessage && (
                <p className={feedbackMessage.includes('Correct') ? 'correct' : 'incorrect'}>
                  {feedbackMessage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Quiz;