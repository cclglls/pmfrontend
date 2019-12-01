import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import SignUpForm from './Components/SignUp';
import SignInForm from './Components/SignIn';

import './Login.css';

class Login extends Component {
  render() {
    return (
      <Router basename='/'>
        <div className='Login'>
          <div className='Login-b'>
            <div className='App__Form'>
              <div className='PageSwitcher'>
                <NavLink
                  to='/Login/sign-in'
                  activeClassName='PageSwitcher__Item--Active'
                  className='PageSwitcher__Item'
                >
                  Sign In
                </NavLink>
                <NavLink
                  exact
                  to='/Login'
                  activeClassName='PageSwitcher__Item--Active'
                  className='PageSwitcher__Item'
                >
                  Sign Up
                </NavLink>
              </div>

              <div className='FormTitle'>
                <NavLink
                  to='/Login/sign-in'
                  activeClassName='FormTitle__Link--Active'
                  className='FormTitle__Link'
                >
                  Sign In
                </NavLink>{' '}
                or{' '}
                <NavLink
                  exact
                  to='/Login'
                  activeClassName='FormTitle__Link--Active'
                  className='FormTitle__Link'
                >
                  Sign Up
                </NavLink>
              </div>

              <Route exact path='/Login/' component={SignUpForm}></Route>
              <Route path='/Login/sign-in' component={SignInForm}></Route>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Login;
