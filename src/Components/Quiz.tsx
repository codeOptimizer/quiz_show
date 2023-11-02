import apiClient from "../ApiClient/ApiClient";
import { Buffer } from 'buffer';

export default interface Quiz extends Array<string> {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
    available_answers: string[];
}


export const getQuizData = ():Promise<Quiz[]> => {
    return apiClient
    .get('/api.php?amount=10&type=multiple&encode=base64')
    .then((response) => {      
        return decodeQuizData(response.data.results);
    })
    .catch((error) => {        
        throw error;
    });
}

export const decodeQuizData = (data : Quiz[]) : Quiz[] => {
    let updatedData: Quiz[] = [];

    data.forEach((quiz) => {
      let category = Buffer.from(quiz.category, 'base64').toString('binary');
      let difficulty = Buffer.from(quiz.difficulty, 'base64').toString('binary');
      let question = Buffer.from(quiz.question, 'base64').toString('binary');
      let type = Buffer.from(quiz.type, 'base64').toString('binary');
      let correct_answer = Buffer.from(quiz.correct_answer, 'base64').toString('binary');
      let incorrect_answers = quiz.incorrect_answers.flatMap((v) => Buffer.from(v, 'base64').toString('binary'));
      let available_answers = getAvailableAnswers(incorrect_answers, correct_answer);
      
      quiz.category = category;
      quiz.difficulty = difficulty;
      quiz.question = question;
      quiz.type = type;
      quiz.correct_answer = correct_answer;
      quiz.incorrect_answers = incorrect_answers;
      quiz.available_answers = available_answers;

      updatedData.push(quiz);
    })

    return updatedData;
  }

  const shuffle = (array: string[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 
  

  function getAvailableAnswers(incorrect_answers: string[], correct_answer: string) : string[] {    
    const answers = [...incorrect_answers, correct_answer];
    const shuffledAnswers = shuffle(answers);
    return shuffledAnswers; 
  }  
