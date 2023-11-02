import { useState, useEffect } from 'react';
import Quiz, { getQuizData } from './Components/Quiz';

import './App.css';

function App() {
  const [quizData, setQuizData] = useState<Quiz[]>([]);  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);

  const isQuizComplete = currentQuestionIndex >= quizData.length;
  const currentQuestion = quizData[currentQuestionIndex];    

  
  useEffect(() => {
    (async () => {
      try {
        const response = await getQuizData();
        setQuizData(response);       
      }
      catch (e) {
        throw e;
      }
    })(); 
  }, [])
    
  
  function QuizCompleteScreen(){
    return (
      <div>
        You completed the quiz. You scored {score} out of {quizData.length}. 
      </div>
    )
  }

  function Quiz() {
    return (
    <div className='quiz-form'>
      <form className='form' onSubmit={(e) => {
        //e.preventDefault();
        //check answer
        if (selectedAnswer === currentQuestion.correct_answer) {
          setScore(score + 1);
        }
        //go to next question, or complete quiz
        setCurrentQuestionIndex(currentQuestionIndex + 1);              
      }}>       
          <div className='question' key={currentQuestionIndex}>
            <div key='category'>{currentQuestion.category}</div>
            <div key='difficulty'>{currentQuestion.difficulty}</div>
            <div key='question'>{currentQuestion.question}</div>
            <div className='answers' key='answers'>
            {currentQuestion.available_answers.flatMap((answer) => {
                return (                
                      <label key={answer}>
                        <input type="radio" name="answer" checked={selectedAnswer === answer} onChange={() => { setSelectedAnswer(answer); }}></input>{" "}{answer}
                      </label>
                );
              })}      
            </div>
          </div>      
        <button className='submit'>Submit</button>
      </form>
    </div>
    )
  }

  return (
    <div className="page">
      {isQuizComplete ? <QuizCompleteScreen /> : <Quiz />}
    </div>
  );
}

export default App;
