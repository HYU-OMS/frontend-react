import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { CssBaseline } from 'material-ui';
import { AppBar } from 'material-ui';

import Home from './home/home';

class App extends React.Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <AppBar position="static">
          <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
        </AppBar>
      </div>
    );
  }
}

export default App;
