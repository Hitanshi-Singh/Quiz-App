/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { resultInitialState } from "../../assets/constants";
import "./Quiz.scss";
import AnswerTimer from "../AnswerTimer/AnswerTimer";
import Result from "../../Result/Result";
const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(null);
  const { question, choices, correctAnswer, type } = questions[currentQuestion];
  const [isAnswer, setIsAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [inputAnswer, setInputAnswer] = useState("");

  const onAnswerClick = (answer, index) => {
    setAnswerIndex(index);
    if (answer == correctAnswer) {
      setIsAnswer(true);
    } else {
      setIsAnswer(false);
    }
  };
  const onClickNext = (finalAnswer) => {
    if (inputAnswer) setInputAnswer(null);
    setAnswerIndex(null);
    setShowAnswerTimer(false);
    setResult((prev) => {
      return finalAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          };
    });
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      //console.log(currentQuestion);
    } else {
      setCurrentQuestion(0);
      setShowResult(true);
    }
    setTimeout(() => {
      setShowAnswerTimer(true);
    });
  };
  const onTryAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
  };
  const handleTimeUp = () => {
    setIsAnswer(false);
    onClickNext(false);
    setInputAnswer(null);
  };
  const handleInputChange = (evt) => {
    setInputAnswer(evt.target.value);
    if (evt.target.value === correctAnswer) {
      setIsAnswer(true);
    } else {
      setIsAnswer(false);
    }
  };
  const getAnswerUI = () => {
    if (type == "FIB") {
      return <input value={inputAnswer} onChange={handleInputChange} />;
    }
    return (
      <ul>
        {choices.map((answer, index) => {
          return (
            <li
              key={answer}
              onClick={() => onAnswerClick(answer, index)}
              className={answerIndex === index ? "selected-answer" : null}
            >
              {answer}
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <div className="quiz-container">
      {!showResult ? (
        <>
          {showAnswerTimer && (
            <AnswerTimer duration={5} onTimeUp={handleTimeUp} />
          )}
          <span className="active-question-no">{currentQuestion + 1}</span>/
          <span className="total-question">{questions.length}</span>
          <h2>{question}</h2>
          {getAnswerUI()}
          <div className="footer">
            <button
              onClick={() => {
                onClickNext(isAnswer);
              }}
              disabled={answerIndex === null && !inputAnswer}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <Result
          result={result}
          onTryAgain={onTryAgain}
          totalQuestions={questions.length}
        />
      )}
    </div>
  );
};

export default Quiz;
