import { handleAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { SET_AVAILABLE_QUESTIONS, SET_NEXT_QUESTION, SHOW_NEW_QUESTION, LOG_RESULT, GAME_OVER, INVALID_TOKEN, SET_TOKEN } from './actions';

function log(text, value) {
  console.log(text, value);
  return value;
}

const reducers = {
  availableQuestions: handleAction(
    SET_AVAILABLE_QUESTIONS,
    (state, action) => action.payload.questions,
    []
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
    (state, action) => log('resultsSoFar', [...state, action.payload]),
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
};

const quizApp = combineReducers(reducers);

export default quizApp;