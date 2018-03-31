import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { CssBaseline } from 'material-ui';

import Home from './home/home';

// import './App.css';

type AppProps = {  };
type AppState = {  };

class App extends React.Component<AppProps, AppState> {
  constructor(props: object) {
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