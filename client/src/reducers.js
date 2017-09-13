const defaultToZero = x => x || 0;

const quizApp = ({ questionCount } = {}) => ({
  questionCount: defaultToZero(questionCount) + 1
});

export default quizApp;