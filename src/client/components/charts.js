import React from 'react';
import { NavLink, useRouteMatch, Switch, Route } from 'react-router-dom';
import ChartId from './chart';

const Charts = (props) => {

  let { path, url } = useRouteMatch();

  return (
    <div>
      <ul className="chart-list">
        <li><NavLink exact className="chart-item" activeClassName="active-chart-item" to={`${url}/events`}>Events</NavLink></li>
        <li><NavLink exact className="chart-item" activeClassName="active-chart-item" to={`${url}/stats`}>Stats</NavLink></li>
        <li><NavLink exact className="chart-item" activeClassName="active-chart-item" to={`${url}/poi`}>POI</NavLink></li>
      </ul>
      <Switch>
        <Route exact path={path}>
        </Route>
        <Route exact path={`${path}/:chart_id`}>
          <ChartId api_data={props.state}/>
        </Route>
      </Switch>
    </div>
  )
}

export default Charts
