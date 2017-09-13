import React, { Component } from 'react';

const Question = ({text, options}) => (
  <div>
    <div>{ text }</div>
    <ul>
      {
        options.map(x => <li>{ x }</li>)
      }
    </ul>
  </div>
);

export default Question;

