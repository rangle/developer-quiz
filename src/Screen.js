import React from 'react';

const headerStyle = {
  backgroundColor: '#508',
  color: '#ff0000',
  height: '30px',
  padding: '30px',
  marginTop: '0',
  paddingLeft: '100px',
};

const bodyStyle = {
  paddingLeft: '100px',
}

const Screen = ({header, body}) => (
  <div>
    <div>
      <h2 style = { headerStyle }> { header }</h2>
    </div>
    <div style = { bodyStyle } >
      { body }
    </div>
  </div>
);

export default Screen;