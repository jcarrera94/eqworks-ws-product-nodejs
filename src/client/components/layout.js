import React from 'react';
import Header from './header';
import Footer from './footer';
import Main from './main';


const Layout = (props) => {
  return (
    <div className="container">
      <div className="content">
        <Header />
        <Main />
      </div>
        <Footer />
    </div>
  )
}

export default Layout
