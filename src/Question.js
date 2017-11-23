import React from 'react';
import marked from 'marked';
import Option from './Option';

const questionStyle = {
  width: '600px',
}

const questionTextStyle = {

};

const Question = ({text, options, chooseAnswer}) => (
  <div style={ questionStyle }>
    <div style={ questionTextStyle } dangerouslySetInnerHTML={{ __html: marked(text) }}/>
    <div>
      {
        options.map((x, i) => <Option key={i} text={x} choose={ () => chooseAnswer(i) }/>)
      }
    </div>
  </div>
);

export default Question;

