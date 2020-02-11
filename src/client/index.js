import React from 'react';
import ReactDom from 'react-dom';
import './styles/main.scss';

const App = () => {
  return (
    <div>
      Hello World
    </div>
  )
};

ReactDom.render(
  <App />,
  document.getElementById('app')
)