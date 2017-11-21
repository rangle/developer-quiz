const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const quiz = require('./quiz');
const privateFunctions = quiz.test;

const questions = [
  //Active?  QuestionID  Difficulty  Tags  Correct Response
  ['TRUE', 1, 4, 'http', 2],
  ['TRUE', 2, 3, 'redux', 1],
  ['FALSE', 3, 2, 'react, redux',  3]
];

describe('processListOfQuestions', function() {

  const processListOfQuestions = privateFunctions.processListOfQuestions;

  it('should filter our inactive questions and remove the flag', function () {
    const processedList = processListOfQuestions(questions);
    expect(processedList.length).to.equal(2);
    expect(processedList[0][0]).to.equal(1);
  });

  it('should filter extra columns', function () {
    const processedList = processListOfQuestions(questions);
    expect(processedList[1].length).to.equal(3);
  });
});

describe('findUser', function() {
  const findUser = privateFunctions.findUser;
  const testSheet = [
    ['bbLdRwU7p9UHYMts', 'Alice'],
    ['aBkm7FVkEM2Rnp2g', 'Bob'],
    ['YJtNafcqEtk7k28E', 'Malory'],
    ['jc4QRGx8UwgpzNtU', 'Zaphod']
  ];
  it('should correctly find and format the user when they are there', function () {
    const user = findUser('YJtNafcqEtk7k28E', testSheet);
    expect(user.name).to.equal('Malory');
    expect(user.row).to.equal(2);
  });
  it('should throw an error when the token is not there', function() {
    expect(x => findUser('YJtNafcqEtk7k28X', testSheet)).to.throw('Invalid user');
  });
});

describe('getColumnLetter', function() {
  const getColumnLetter = privateFunctions.getColumnLetter;
  it('should properly handle numbers up to 26', function() {
    expect(getColumnLetter(0)).to.equal('A');
    expect(getColumnLetter(25)).to.equal('Z');
  });
  it('should properly handle numbers from 26 to 675', function() {
    expect(getColumnLetter(26)).to.equal('BA');
    expect(getColumnLetter(675)).to.equal('ZZ');
  });
  it('should throw an error on bad input', function() {
    const testBad = badInput => {
      expect(() => getColumnLetter(badInput)).to.throw('Invalid column index');
    };
    testBad('apple');
    testBad(-1);
    testBad(676);
  });
});

describe('getResultsCellRange', function() {
  it('should correctly handle basic cases', function() {
    const test = (row, column, result) => {
      expect(privateFunctions.getResultsCellRange(row, column)).to.equal(result);
    }
    test(0, 0, 'Results!F2');
    test(1, 0, 'Results!F3');
    test(0, 1, 'Results!I2');
    test(1, 1, 'Results!I3');
  });
});

describe('parseQuestionPosition', function() {
  it('should correctly parse good input', function() {
    const test = (value, result) => {
      expect(privateFunctions.parseQuestionPosition(value)).to.equal(result);
    }
    test('1', 1);
    test('12', 12);
  });
  it('should reject bad input', function() {
    const testBad = (value) => {
      expect(() => privateFunctions.parseQuestionPosition(value)).to.throw('Invalid question position');
    }
    testBad(-1);
    testBad('-1');
    testBad('200');
  });
});

describe('findQuestion', function() {
  const findQuestion = privateFunctions.findQuestion;
  it('should correctly find the question when it exists', function() {
    expect(findQuestion(questions, 1)).to.deep.equal({
      active: 'TRUE',
      questionId: 1,
      difficulty: 4,
      tags: 'http',
      correctResponse: 2
    });
    expect(findQuestion(questions, 2)).to.deep.equal({
      active: 'TRUE',
      questionId: 2,
      difficulty: 3,
      tags: 'redux',
      correctResponse: 1
    });
  });
  it('should throw an error when the question is not found', function() {
    expect(() => findQuestion(questions, 99)).to.throw('Invalid question');
  });
});

