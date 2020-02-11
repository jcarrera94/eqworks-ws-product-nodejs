import React from 'react';
import { render } from 'react-dom';
import './styles/main.scss';

const App = () => {
  return (
    <div>
      Hello World
    </div>
  )
};

render(
  <App />,
  document.getElementById('app')
)