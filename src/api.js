const USE_MOCKS = false;
const MOCK_DELAY = 50;
const SERVER_URL_BASE = process.env.NODE_ENV === 'production' ?
  '/api/'
  : 'http://localhost:3000/api/';

// Mock data to use when mocking server responses locally.
const MOCK_DATA = {
  'questions': [
    {questionId: '1', difficulty: 1},
    {questionId: '2', difficulty: 2},
    {questionId: '3', difficulty: 3},
  ],
  'actualQuestions': {
    '1': {
      questionBody: 'Lorem ipsum **apple** or **banana**?',
      options: ['**Apple**', 'Banana']
    },
    '2': {
      questionBody: 'Lorem ipsum **one** or **two**?',
      options: ['One', 'Two']
    },
    '3': {
      questionBody: 'Lorem ipsum **what**?',
      options: ['One', 'Two', 'Apple', 'Banana']
    }
  }
};

// Returns a promise for some data with a bit of a delay.
const mockGet = (token, data) => new Promise((resolve, reject) => {
  setTimeout( () => {
    if (token==='aaa') {
      resolve(data);
    } else {
      reject(new Error('Invalid user.'));
    }
  }, MOCK_DELAY);
});

// Builds a URL.
const getUrl = (token, path) => SERVER_URL_BASE + token + '/' + path;

// Make an HTTP get.
const get = (token, path) => fetch(getUrl(token, path))
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  });

// Gets the list of questions from the server.
exports.getListOfQuestions = token => USE_MOCKS ?
  mockGet(token, { questions: MOCK_DATA.questions })
  : get(token, 'questions');

exports.getActualQuestion = (token, id) => USE_MOCKS ?
  mockGet(token, { question: MOCK_DATA.actualQuestions[id] })
  : get(token, 'questions/' + id);

// const post = (token, path) => fetch(getUrl(token, path), {
//   method: 'POST',
//   body: form
// });

//   )

exports.postAnswer = (token, questionId, response, questionPosition) => USE_MOCKS ?
  mockGet(token, {
    isCorrect: 0,
  })
  : get(token, `reply/${questionId}/${response}/${questionPosition-1}`);
