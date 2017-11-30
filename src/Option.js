import React from 'react';
import marked from 'marked';

const optionStyle = {
  border: '2px solid black',
  padding: '10px',
  width: '100%',
  margin: '10px',
  cursor: 'pointer',
  textAligh: 'left',
  fontSize: '10pt',
  backgroundColor: 'lightGray',
};

const innerTextStyle = {
  textAlign: 'left',
};

const Option = ({text, choose}) => (
  <div style={ optionStyle } onClick={ choose } >
    <div style={ innerTextStyle } dangerouslySetInnerHTML={{ __html: marked(text) }}/>
  </div>
)

export default Option;
