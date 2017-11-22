import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import quizApp from './reducers';

const store = createStore(quizApp);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={ store }>
    <App />
  </Provider>, div);
});
