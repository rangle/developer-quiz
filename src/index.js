import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import './index.css';
import App from './App';
import quizApp from './reducers';
import { initialize } from './actions';
import registerServiceWorker from './registerServiceWorker';

const DEBUG = process.env.NODE_ENV !== 'production';

const store = createStore(
  quizApp,
  applyMiddleware(...[
    thunk,
    DEBUG ? logger : null
  ].filter(x => x))
);

store.dispatch(initialize());

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();

window.onbeforeunload = function() { return "Your work will be lost."; };