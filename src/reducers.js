import { handleAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { SET_AVAILABLE_QUESTIONS, SET_NEXT_QUESTION, SHOW_NEW_QUESTION, LOG_RESULT, GAME_OVER, INVALID_TOKEN, SET_TOKEN } from './actions';

/* function log(text, value) {
  console.log(text, value);
  return value;
} */

const trimDifficulty = difficulty => Math.max(Math.min(difficulty, 5), 1);

const reducers = {
  availableQuestions: handleAction(
    SET_AVAILABLE_QUESTIONS,
    (state, action) => action.payload.questions,
    []
  ),
  name: handleAction(
    SET_AVAILABLE_QUESTIONS,
    (state, action) => action.payload.name,
    null
  ),
  usedQuestions: handleAction(
    SET_NEXT_QUESTION,
    (state, action) => ({[action.payload.questionId]: true, ...state}),
    {}
  ),
  currentQuestion: handleActions({
    [SET_NEXT_QUESTION]: (state, action) => ({questionBody: 'Loading', options:[]}),
    [SHOW_NEW_QUESTION]: (state, action) => action.payload
  }, null),
  questionCount: handleAction(
    SET_NEXT_QUESTION,
    (state, action) => state + 1,
    0
  ),
  resultsSoFar: handleAction(
    LOG_RESULT,
    (state, action) => [...state, action.payload],
    []
  ),
  isGameOver: handleAction(
    GAME_OVER,
    (state, action) => true,
    false
  ),
  isTokenInvalid: handleAction(
    INVALID_TOKEN,
    (state, action) => true,
    false
  ),
  token: handleAction(
    SET_TOKEN,
    (state, action) => action.payload.token,
    null
  ),
  difficulty: handleAction(
    LOG_RESULT,
    (state, action) => trimDifficulty(state + (action.payload.isCorrect? 1 : -1)),
    1
  )
};

const quizApp = combineReducers(reducers);

export default quizApp;