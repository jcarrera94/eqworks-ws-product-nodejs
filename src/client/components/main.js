import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useApplicationData } from '../hooks/useApplicationData';
import Home from './home';
import Charts from './charts';
import Table from './table';

const Main = () => {

  const { state } = useApplicationData();

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/charts">
        <Charts state={state}/>
      </Route>/>
      <Route path="/table">
        <Table state={state}/>
      </Route>/>
    </Switch>
  )
}

export default Main
