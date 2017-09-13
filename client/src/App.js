import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Question from './Question';
import { submitAnswer } from './actions';

const App = ({questionCount, submitAnswer}) => (
  <div className="App">
    <div className="App-header">
      <h2>{ questionCount }</h2>
    </div>
    <p className="App-intro">
      <Question text="Hello" options={[1,2,3]}/>
    </p>
    <button onClick={ x => submitAnswer() }>Next</button>
  </div>
);

function mapStateToProps(state) {
  return {
    questionCount: state.questionCount
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitAnswer: () => dispatch(submitAnswer()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
