// Provides some wrappers around the Google Sheets API to make it easier to
// use the ones we are going to use. This module doesn't really do anything
// particularly application-specific, just some utilities.

const R = require('ramda');
const google = require('googleapis');
const sheets = google.sheets('v4');

// Takes a function that expects a callback and returns a promise.
const callAndReturnAPromise = fn => new Promise(function(resolve, reject) {
  fn(function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      reject(err);
    } else {
      resolve(response);
    }
  });
});

// A curried sheet updater function.
exports.update = R.curry((id, auth, range, values) =>
  callAndReturnAPromise(cb => {
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: id,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    }, cb);
  }));

// A curried sheet appender function.
exports.append = R.curry((id, auth, range, values) =>
  callAndReturnAPromise(cb => {
    sheets.spreadsheets.values.append({
      auth: auth,
      spreadsheetId: id,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    }, cb);
  }));

// A curried function for getting values from a sheet.
exports.get = R.curry((id, auth, range) =>
  callAndReturnAPromise(cb => {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: id,
      range: range,
    }, cb);
  }).then(response => response.values));