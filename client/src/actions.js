
import { createAction } from 'redux-actions';
import { getListOfQuestions, getActualQuestion, postAnswer } from './api';

const INITIALIZE = 'INITIALIZE';
const SET_TOKEN = 'SET_TOKEN';
const INVALID_TOKEN = 'INVALID_TOKEN';
const SET_AVAILABLE_QUESTIONS = 'SET_AVAILABLE_QUESTIONS';
const PICK_NEXT_QUESTION = 'PICK_NEXT_QUESTION';
const SET_NEXT_QUESTION = 'SET_NEXT_QUESTION';
const SHOW_NEW_QUESTION = 'SHOW_NEW_QUESTION'
const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
const LOG_RESULT = 'LOG_RESULT';
const GAME_OVER = 'GAME_OVER';

// Initializes the app.
const initialize = () => dispatch => {
  const token = window.location.pathname.slice(1);
  if (token.length > 0) {
    dispatch(setToken(token));
    getListOfQuestions(token)
      .then(questionsAndName => {
        dispatch(setAvailableQuestions(questionsAndName.questions));
        dispatch(pickNextQuestion());
      })
      .catch(error => {
        console.error('ERROR GETTING QUESTION LIST.');
        dispatch(invalidToken());
      });
  }
};

// Sets the user token.
const setToken = createAction(SET_TOKEN,
  token => ({token})
);

// Declares invalid token.
const invalidToken = createAction(INVALID_TOKEN);

// Adds the bank of questions when they have arrived from the server.
const setAvailableQuestions = createAction(
  SET_AVAILABLE_QUESTIONS,
  value => ({
    questions: value
  })
);

// Picks a new question from among the ones that are available.
const pickNextQuestion = () => {
  return (dispatch, getState) => {
    const state = getState();
    const question = state.availableQuestions[state.questionCount];
    // Right now we just pick the next question in the list of questions.
    // TODO: Factor in state.resultsSoFar
    if (question) {
      dispatch(setNextQuestion(question));
      getActualQuestion(state.token, question.questionId)
        .then(actualQuestion => {
          console.log('ACTUAL QUESTION', actualQuestion.question);
          dispatch(showNewQuestion(actualQuestion.question));
        });
    } else {
      dispatch(gameOver());
    }
  };
};

// Sets the next question.
const setNextQuestion = createAction(SET_NEXT_QUESTION);

// Shows the new question.
const showNewQuestion = createAction(SHOW_NEW_QUESTION);

// Submits the response to the question.
const submitAnswer = optionId => (dispatch, getState) => {
  console.log('Submitted answer:', optionId);
  const state = getState();
  postAnswer(state.token, state.currentQuestion.questionId, optionId, state.questionCount)
    .then(function(response) {
      console.log('RESPONSE', response);
      dispatch(logResult({correct: response.isCorrect, ...state.currentQuestion}));
      dispatch(pickNextQuestion())
    });
};

// Logs the result of user's submission.
const logResult = createAction(LOG_RESULT);

// Competes the quiz.
const gameOver = createAction(GAME_OVER);

export {
  INITIALIZE,
  initialize,
  SET_TOKEN,
  setToken,
  INVALID_TOKEN,
  invalidToken,
  SET_AVAILABLE_QUESTIONS,
  setAvailableQuestions,
  PICK_NEXT_QUESTION,
  pickNextQuestion,
  SET_NEXT_QUESTION,
  setNextQuestion,
  SHOW_NEW_QUESTION,
  showNewQuestion,
  SUBMIT_ANSWER,
  submitAnswer,
  LOG_RESULT,
  logResult,
  GAME_OVER,
  gameOver,
};