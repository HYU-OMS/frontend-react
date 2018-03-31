import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { CssBaseline } from 'material-ui';

import Home from './home/home';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }
  
  render() {
    return (
      <div>
        <CssBaseline />
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect to="/home" /> 
        </Switch>
      </div>
    );
  }
}

export default App;