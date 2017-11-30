import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import Question from './Question';
import Screen from './Screen';
import { initialize, submitAnswer, pickNextQuestion } from './actions';


function predicateSwitch(conditions) {
  const index = conditions.findIndex(condition => condition.condition);
  return conditions[index].content();
}

const introStyle = {
  width: '600px',
};

const App = ({name, pickNextQuestion, questionCount, currentQuestion, isGameOver, isTokenInvalid, difficulty, submitAnswer, initialize}) => (
  <div className="App">

    { predicateSwitch([{
        condition: isGameOver,
        content: () => (
          <Screen
            header = "Thank you for playing!"
            body = "Your answers were recorded and our talent team will be in touch with you shortly!"
          />
        )
      }, {
        condition: isTokenInvalid,
        content: () => (
          <Screen header = "Oh-oh..." body = "Maybe you don’t have the right token?"/>
        )
      }, {
        condition: currentQuestion,
        content: () => (
          <Screen
            header = {<span>Question { questionCount } of 10.</span>}
            body = {
              <Question
                text={ currentQuestion.questionBody }
                options={ currentQuestion.options }
                chooseAnswer={ submitAnswer } />
            }
          />
        )
      }, {
        condition: name,
        content: () => (
          <Screen
            header = "Welcome to the Rangle Developer Quiz!"
            body = {
              <div style={ introStyle }>
                <p>Hi, { name }!</p>

                <p>Welcome to the Rangle Developer Quiz!</p>                

                <p>
                This quiz will ask you 10 questions and record your answers.
                </p>

                <p>
                We’ll start with the easier questions and will adjust
                the difficulty based on how well you answer.
                So, don’t worry if the questions get difficult
                – this could just mean you are doing really well!
                </p>

                <p>
                We’ll record the time you spend on each answer, but there is no time limit.
                Take the time you feel is reasonable.
                </p>

                <p>
                Please press "Start" to get started.
                </p>

                <p>
                <button onClick={ pickNextQuestion }>Start</button>
                </p>
              </div>
          } />
         )
      }, {
        condition: true,
        content: () => (
          <Screen header = "" body = ""
          />
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
    difficulty: state.difficulty,
    name: state.name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitAnswer: (x) => dispatch(submitAnswer(x)),
    initialize: () => dispatch(initialize()),
    pickNextQuestion: () => dispatch(pickNextQuestion()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
