import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/layout';
require('./styles/index.scss')


const App = () => {
  return (
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  )
};

ReactDom.render(
  <App />,
  document.getElementById('app')
)