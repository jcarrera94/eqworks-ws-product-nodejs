import React from 'react';
import Header from './header';
import Main from './main';


const Layout = (props) => {
  return (
    <div className="container">
      <div className="content">
        <Header />
        <Main />
      </div>
    </div>
  )
}

export default Layout
