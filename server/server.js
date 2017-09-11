const koa = require('koa2');
const app = new koa();
var router = require('koa-router')();
const {authenticate} = require('./lib/googleauth');
const quiz = require('./lib/quiz');

// Wrapper for logging, etc.
app.use(async (ctx, next) => {
  const start = new Date;
  console.log(`Started at: ${start}`);
  await next();
  const ms = new Date - start;
  console.log(`Elapsed: ${ms}ms`);
});

// Authenticate with Google.
app.use(async (ctx, next) => {
  ctx.quiz = {};
  ctx.quiz.googleauth = await authenticate();
  await next();
});

// Routing
app.use(router.routes())
  .use(router.allowedMethods());

// A handler that verifies that we've got a valid user token. We'll be
// applying this to most routes.
const checkUser = async function(ctx, next) {
  ctx.quiz.user = await quiz.getUser(ctx.quiz.googleauth, ctx.params.userId);
  await next();
}


// Retrieves the list of questions. This will be the first request that the
// client application makes to the server.
router.get('/:userId/questions', checkUser, async function (ctx, next) {
    const questions = await quiz.getListOfQuestions(ctx.quiz.googleauth);
    console.log(questions);
    ctx.body = JSON.stringify({questions: questions, name: ctx.quiz.user.name}, null, 2);
  });

// Records the response to a question. Note that the client application
// doesn't know whether the response was correct until it has made this
// request.
//
// We are using GET for now to simplify testing.
router.get('/:userId/reply/:questionID/:response/:questionPosition', checkUser, async function (ctx, next) {
    const response = await quiz.saveResponse(ctx.quiz.googleauth, ctx.quiz.user, {
      questionID: ctx.params.questionID,
      response: ctx.params.response,
      questionPosition: ctx.params.questionPosition,
    });
    ctx.body = JSON.stringify(response);
  });

app.listen(3000);