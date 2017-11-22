// This module handles most of the application-specific logic. In particular,
// this is where we keep the knowledge of how to interprete the information
// about the google sheets. At this point we are working with two sheets.
//
// SHEET ONE: QUESTION
//
// This sheet contains one worksheet called "Questions", which serves a an
// index of questions. It has the following columns:
//
// * Active? (is the question currently "active")
// * QuestionID (a numberic ID of the question)
// * Difficulty (a number indicating how difficult the question is)
// * Tags (a comma-separated list of tags, e.g., "react, redux")
// * Correct Response (the number of the response that would be correct)
//
// Ths sheet does not have actual questions - those will be provided as
// markdown files.
//
// SHEET TWO: OUTPUT
//
// This sheet has two worksheets: "Results" and "Log".

// "Results" has one row for each candidate:
//
// * Token - candidate tokens, along the lines of "bbLdRwU7p9UHYMts". This is
//   how we identify candidates. This needs to be generated somehow.
// * First Name - candidate's first name. Needs to be entered by the talent
//   team.
// * Last Name - candidate's first name. Needs to be entered by the talent
//   team.
// * Overall Score - candidate's overall score. Will be calculated by a
//  spreadsheet formula.
// * Notes - arbitrary notes about the candidate.
//
// After that we have columns representing the candidate's answer to the quiz,
// in groups of three: question ID, difficulty of questions, and points for
// the question.
//
//
// The "Log" worksheet records more details about each response from the
// candidate.
//
// The client application is expected to first request the list of questions,
// then start presenting the questions to the candidate and call the server
// for every response. (The client application decides which questions to
// ask.)
//
// SECURITY
//
// There is no authentication here: if the visitor can provide a token, they
// get to answer the quiz as that candidate. Right now nothing prevents the
// visitor from answering multiple times: new answers will overwrite the old
// ones. This check can be added later.

const {update, append, get} = require('./googlesheet');
const R = require('ramda');
const findIndex = require('array.prototype.findindex');

const OUTPUT_DOC_ID = process.env.OUTPUT_DOC_ID;
const QUESTION_DOC_ID = process.env.QUESTION_DOC_ID;

// An object to export private functions we want to unit-test.
const test = {};
exports.test = test;

var questionDataCache = null;

// Gets question data either from a cache or from Google Docs.
function getQuestionData(auth) {
  questionDataCache = questionDataCache || get(QUESTION_DOC_ID, auth, 'Questions!A2:G500');
  return questionDataCache;
}

// Clears the cache.
exports.clearCache = function() {
  questionDataCache = null;
}

// Takes a list (index) of questions from a Google Sheet, extracts
// approprivate ones and columns that might contain answers.
const processListOfQuestions
  = test.processListOfQuestions
  = list => 
    list.filter(question => question[0] === 'TRUE')
      .map(question => ({
        questionId: question[1],
        difficulty: question[2],
        tags: question[3],
      }));

// Gets the list of question via Google API and transforms it for the client.
exports.getListOfQuestions = (auth) =>
  getQuestionData(auth)
    .then(processListOfQuestions);

// Finds a user by token in the list of users received from a Google Sheet,
// looks for a user by token and returns an object representing the user.
// Throws an error if unable to find the token.
const findUser = test.findUser = R.curry((token, values) => {
  const tokens = values.map(x => x[0])
  const index = tokens.indexOf(token);
  if (index < 0) {
    throw new Error('Invalid user');
  }
  return {
    row: index,
    token: token,
    name: values[index][1]
  };
});

// Gets the list of users via Google API and looks for the needed user by token.
exports.getUser = (auth, userId) => get(OUTPUT_DOC_ID, auth, 'Results!A2:B1000')
  .then(findUser(userId));

// Converts an index into letters representing the column in the "A1"
// notation. Handles columns up to "ZZ".
const getColumnLetter = test.getColumnLetter = colNumber => {
  if (typeof colNumber !== 'number' || colNumber < 0 || colNumber > 675) {
    throw new Error('Invalid column index');
  }
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numLettersInAlphabet = alphabet.length;
  const firstLetterPosition = Math.floor(colNumber / numLettersInAlphabet);
  const secondLetterPosition = colNumber % numLettersInAlphabet;
  const firstLetter = firstLetterPosition? alphabet[firstLetterPosition] : '';
  const secondLetter = alphabet[secondLetterPosition];
  return firstLetter+secondLetter;
};

// Converts a user row number and a question column position into a range in
// the "A1" format.
const getResultsCellRange = test.getResultsCellRange = (userRow, questionPosition) => {
  const NUMBER_OF_HEADER_ROWS = 1;
  const zeroBasedToOneBased = x => x + 1;
  const COLUMNS_PER_QUESTION = 3;
  const NUMBER_OF_RESERVED_COLUMNS = 5;
  const rowNumber = zeroBasedToOneBased(userRow) + NUMBER_OF_HEADER_ROWS;
  const columnNumber = questionPosition * COLUMNS_PER_QUESTION + NUMBER_OF_RESERVED_COLUMNS;
  return `Results!${getColumnLetter(columnNumber)}${rowNumber}`;
}

// Parses the question position represented as a string into a number and
// validates it.
const parseQuestionPosition = test.parseQuestionPosition = questionPosition => {
  const parsedPosition = parseInt(questionPosition);
  if (isNaN(parsedPosition) || parsedPosition < 0 || parsedPosition >= 200) {
    throw new Error('Invalid question position');
  }
  return parsedPosition;
}

// Finds the question in the index of questions received from the Google sheet
// API.
const findQuestion = test.findQuestion = (questions, questionID) => {
  const question = questions.filter(x => x[1] === questionID)[0];
  if (!question) {
    throw new Error('Invalid question');
  }
  const [active, questionId, difficulty, tags, correctResponse] = question;
  return {
    active, questionId, difficulty, tags, correctResponse,
  };
}

// Saves a response to a question and informs the caller whether the answer
// was correct.
exports.saveResponse = async (auth, user, params) => {
  const questionPosition = parseQuestionPosition(params.questionPosition);
  const updateOutputDoc = update(OUTPUT_DOC_ID, auth);
  const appendToOutputDoc = append(OUTPUT_DOC_ID, auth);
  const question = findQuestion(
    await getQuestionData(auth),
    params.questionID
  );
  const isCorrect = 'ABCD'[params.response] === question.correctResponse;

  // We'll let the function return before those promises are resolved.
  updateOutputDoc(
    getResultsCellRange(user.row, questionPosition),
    [[
      params.questionID,
      question.difficulty,
      isCorrect? question.difficulty : 0,
    ]]
  )
  .catch(e => console.error(e));

  appendToOutputDoc(
    'Log!A1:H1',
    [[
      'time now', // Timestamp
      user.name, // User
      user.token, // Token
      question.questionId, // Question
      question.difficulty, // Difficulty
      question.tags, // Tags
      isCorrect? 'TRUE' : 'FALSE', // Correct
      params.response, // Response
      /* Todo */ // Rebuttal
    ]]
  )
  .catch(e => console.error(e));

  return { 
    isCorrect,
  };
};

// Finds the full question (including the body and the options) in the
// index of questions received from the Google sheet API.

const findFullQuestion = test.findFullQuestion = (rows, questionId) => {
  findIndex.shim();
  const index = rows.findIndex(x => x[1] === questionId);
  if (index < 0) {
    throw new Error('Invalid question');
  }
  console.log('Index: ', index);
  const questionBody = rows[index][6];
  const options = [1,2,3,4].map(offset => rows[index + offset][6]);
  return {
    questionId, questionBody, options
  };
}

// Gets the description and the options for a question by questionID.
exports.getQuestion = (auth, questionId) =>
  getQuestionData(auth)
    .then(rows => findFullQuestion(rows, questionId));