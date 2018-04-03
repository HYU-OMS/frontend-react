import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './home/home';

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" /> 
        </Switch>
      </div>
    );
  }
}

export default App;
