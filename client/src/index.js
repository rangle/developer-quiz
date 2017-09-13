import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import quizApp from './reducers'
import registerServiceWorker from './registerServiceWorker';

const store = createStore(quizApp)

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
