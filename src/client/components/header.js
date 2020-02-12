import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <h1 className="title">EQworks - Work Sample</h1>
      <nav>
        <ul className="nav-list">
          <li><NavLink className="nav-item" activeClassName="active-nav-item" exact to="/">Home</NavLink></li>
          <li><NavLink className="nav-item" activeClassName="active-nav-item" to="/charts">Charts</NavLink></li>
          <li><NavLink className="nav-item" activeClassName="active-nav-item" to="/table">Table</NavLink></li>
          <li><NavLink className="nav-item" activeClassName="active-nav-item" to="/geo-nav">GeoNav</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
