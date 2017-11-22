import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import Question from './Question';
import { initialize, submitAnswer } from './actions';


function predicateSwitch(conditions) {
  const index = conditions.findIndex(condition => condition.condition);
  return conditions[index].content();
}

const App = ({questionCount, currentQuestion, isGameOver, isTokenInvalid, submitAnswer, initialize}) => (
  <div className="App">

    { predicateSwitch([{
        condition: isGameOver,
        content: () => (
          <div>
            GAME OVER
          </div>
        )
      }, {
        condition: isTokenInvalid,
        content: () => (
          <div>
            INVALID TOKEN
          </div>
        )
      }, {
        condition: currentQuestion,
        content: () => (
          <div>
            <div className="App-header">
              <h2>{ questionCount }</h2>
            </div>
            <div className="App-intro">
              <Question
                text={ currentQuestion.questionBody }
                options={ currentQuestion.options }
                chooseAnswer={ submitAnswer } />
            </div>
          </div>
        )
      }, {
        condition: true,
        content: () => (
          <div>
            loading questions...
          </div>
        )
      }])
    }
  </div>
);

function mapStateToProps(state) {
  return {
    currentQuestion: state.currentQuestion,
    questionCount: state.questionCount,
    questionsLoaded: state.availableQuestions.length,
    isGameOver: state.isGameOver,
    isTokenInvalid: state.isTokenInvalid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitAnswer: (x) => dispatch(submitAnswer(x)),
    initialize: () => dispatch(initialize()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
