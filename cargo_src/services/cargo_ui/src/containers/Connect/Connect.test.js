import React from 'react';
import ReactDOM from 'react-dom';
import Connect from './Connect';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Connect />, div);
  ReactDOM.unmountComponentAtNode(div);
});
