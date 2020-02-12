import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useApplicationData } from '../hooks/useApplicationData';
import Home from './home';
import Charts from './charts'

const Main = () => {

  const { state } = useApplicationData();

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/charts">
        <Charts state={state}/>
      </Route>/>
    </Switch>
  )
}

export default Main
