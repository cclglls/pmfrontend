import React, { Component } from 'react';
import './App.css';
import { Input, Button } from 'antd';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// import ipAddress from '../config'

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitSignUp = this.handleSubmitSignUp.bind(this);
    this.handleSubmitSignIn = this.handleSubmitSignIn.bind(this);
    this.state = {
      SignUpFirstName: '',
      SignUpLastName: '',
      SignUpEmail: '',
      SignUpPassword: '',
      SignInEmail: '',
      SignInPassword: '',
      isUserExist: false
    };
  }

  handleSubmitSignUp() {
    //console.log('BOUTTON OK');

    fetch(`http://localhost:3000/users/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `firstname=${this.state.SignUpFirstName}&lastname=${this.state.SignUpLastName}&email=${this.state.SignUpEmail}&password=${this.state.SignUpPassword}`
    })
      .then(function(res, err) {
        return res.json();
      })
      .then(data => {
        //console.log('Dans mon fetch -->', data);

        this.setState({
          isUserExist: true
        });
        this.props.signin(data.user);
      });
  }

  handleSubmitSignIn() {
    //console.log('Dans HandleSubmitIn', this.state.SignInEmail);

    fetch(
      `http://localhost:3000/users/sign-in?email=${this.state.SignInEmail}&password=${this.state.SignInPassword}`
    )
      .then(response => response.json())
      .then(data => {
        //console.log('Dans mon fetch -->', data);

        // NE FONCTIONNE PAS
        if (data.isUserExist) {
          this.setState({
            isUserExist: true
          });
          this.props.signin(data.user);
        }
      });
  }

  render() {
    if (this.state.isUserExist) {
      return <Redirect to='/Homepage' />;
    }

    return (
      <div className='Login-page'>
        {/* SIGN-IN */}

        <div className='Sign'>
          <Input
            onChange={e => this.setState({ SignInEmail: e.target.value })}
            className='Login-input'
            placeholder='email'
          />

          <Input.Password
            onChange={e => this.setState({ SignInPassword: e.target.value })}
            className='Login-input'
            placeholder='password'
          />

          <Button
            onClick={this.handleSubmitSignIn}
            style={{ width: '80px' }}
            type='primary'
          >
            Sign-in
          </Button>
        </div>

        {/* SIGN-UP */}

        <div className='Sign'>
          <Input
            onChange={e => this.setState({ SignUpFirstName: e.target.value })}
            className='Login-input'
            placeholder='FirstName'
          />

          <Input
            onChange={e => this.setState({ SignUpLastName: e.target.value })}
            className='Login-input'
            placeholder='Name'
          />

          <Input
            onChange={e => this.setState({ SignUpEmail: e.target.value })}
            className='Login-input'
            placeholder='email'
          />

          <Input.Password
            onChange={e => this.setState({ SignUpPassword: e.target.value })}
            className='Login-input'
            placeholder='password'
          />

          <Button
            onClick={this.handleSubmitSignUp}
            style={{ width: '80px' }}
            type='primary'
          >
            Sign-up
          </Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signin: function(user) {
      dispatch({ type: 'signin', user });
    }
  };
}

export default connect(null, mapDispatchToProps)(Login);
