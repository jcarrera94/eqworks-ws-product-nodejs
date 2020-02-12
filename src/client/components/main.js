import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import Charts from './charts'

const Main = () => {

  

  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/charts" component={Charts}></Route>
    </Switch>
  )
}

export default Main
