import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import App from './component/App';
import * as serviceWorker from './serviceWorker';

import reducer from './reducer';

const store = createStore(reducer);
const max_snack = (window.innerWidth < 600) ? 1 : 5;
const horizontal_position = (window.innerWidth < 600) ? 'center': 'left';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: horizontal_position,
        }}
        maxSnack={max_snack}
        dense={window.innerWidth < 600}
      >
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
