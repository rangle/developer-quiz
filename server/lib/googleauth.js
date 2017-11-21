// This module handles Google authorization. Much of it is based on Google's
// "quickstart.js" example, but rewritten with promises and async/await.

const fs = require('fs');
const readline = require('readline');
const googleAuth = require('google-auth-library');
const denodeify = require('denodeify');
const readFile = denodeify(fs.readFile);
const writeFile = denodeify(fs.writeFile);

const GOOGLE_AUTH_TOKEN_FILE = process.env.GOOGLE_AUTH_TOKEN_FILE;
if (!GOOGLE_AUTH_TOKEN_FILE) {
  throw new Error('Location of Google auth token file not specified.');
}

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Creates an OAuth2 client with credentials provided in JSON files.
exports.authorize = async function() {
  // Load permanent credentials.
  const credentialsString = await readFile('client_secret.json');
  const credentials = JSON.parse(credentialsString);
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  );

  // Load the token if we have it.
  try {
    const token = await readFile(GOOGLE_AUTH_TOKEN_FILE);
    oauth2Client.credentials = JSON.parse(token);
    return oauth2Client;
  } catch (e) {
    await getNewToken(oauth2Client);
  }
}

// Asks a question via readline and returns a promise for the answer.
function askWithReadline(question) {
  return new Promise((resolve, reject) => {
    const interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interface.question(question, value => {
      interface.close();
      resolve(value);
    });
  })
}

// Attempts to obtain and store a new token for an OAuth2 client.
async function getNewToken(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const code = await askWithReadline('Enter the code from that page here: ');
  console.log('code', code);
  const getToken = denodeify(oauth2Client.getToken.bind(oauth2Client));
  const token = await getToken(code);
  console.log('token', token);
  oauth2Client.credentials = token;
  // Store the token for later use.
  await writeFile(GOOGLE_AUTH_TOKEN_FILE, JSON.stringify(token));
  console.log('Token stored to ' + GOOGLE_AUTH_TOKEN_FILE);
  return oauth2Client;
}