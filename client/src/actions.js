import { createAction } from 'redux-actions';

const INITIALIZE = 'INITIALIZE';
const SET_AVAILABLE_QUESTIONS = 'SET_AVAILABLE_QUESTIONS';
const PICK_NEXT_QUESTION = 'PICK_NEXT_QUESTION';
const SET_NEXT_QUESTION = 'SET_NEXT_QUESTION';
const SHOW_NEW_QUESTION = 'SHOW_NEW_QUESTION'
const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
const 

const makeAction = type => payload => {type, payload};

// Initialize the app.
const initialize = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(setAvailableQuestions([
        {questionId: '00001', difficulty: 1},
        {questionId: '00002', difficulty: 2},
        {questionId: '00003', difficulty: 3},
      ]));
    }, 1000);    
  };
}

// Adds questions when they are arrived by the server.
const setAvailableQuestions = createAction(SET_AVAILABLE_QUESTIONS);

// Pick a new question.
const pickNextQuestion = () => {
  return (dispatch, getState) => {
    const state = getState();
    // TODO: Factor in state.resultsSoFar
    // TODO: Factor in state.availableQuestions
    dispatch(setNextQuestion({questionId: 1, difficulty: 2}));
    // TODO: Should be async based on the server response.
    dispatch(showNewQuestion({questionBody: 'Lorem', options: ['X', 'Y']}));
  }
};

// Sets the next question.
const setNextQuestion = createAction(SET_NEXT_QUESTION);

// Shows the new question.
const showNewQuestion = createAction(SHOW_NEW_QUESTION);

// Submits the response to the question.
const submitAnswer = createAction(SUBMIT_ANSWER, optionId => { optionId });

export {
  SUBMIT_ANSWER,
  submitAnswer,
}