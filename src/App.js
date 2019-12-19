import React, { Component } from 'react';
import './App.css';
import Login from './Login';
//import Login from './Login_gilles';
import HomePage from './Components/HomePage';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import appli from './Components/Reducer/appli.reducer';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
const store = createStore(
  combineReducers({ appli }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Switch>
              <Route path='/' exact render={props => <Login />} />
              <Route path='/HomePage' render={props => <HomePage />} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

//<Route path='/' exact component={Login} />
//<Route path='/HomePage' component={HomePage} />

export default App;
