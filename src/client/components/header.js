import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="title">
        <NavLink to="/"><h1>EQworks - Work Sample</h1></NavLink>
      </div>
      <nav>
        <ul className="nav-list">
          <li><NavLink className="nav-item" activeClassName="active-nav-item" exact to="/">Home</NavLink></li>
          <li><NavLink className="nav-item" activeClassName="active-nav-item" to="/charts">Charts</NavLink></li>
          <li><NavLink className="nav-item" activeClassName="active-nav-item" to="/table">Table</NavLink></li>
          <li><NavLink className="nav-item" activeClassName="active-nav-item" to="/geo-nav">GeoNav</NavLink></li>
        </ul>
      </nav>
      <hr />
    </header>
  )
}

export default Header
