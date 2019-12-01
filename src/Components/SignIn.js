import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../Login.css';

class SignInForm extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      isUserExist: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    console.log('The form was submitted with the following data:');
    console.log(this.state);

    fetch(
      `http://localhost:3000/users/sign-in?email=${this.state.email}&password=${this.state.password}`
    )
      .then(response => response.json())
      .then(data => {
        console.log('Dans mon fetch -->', data);

        // NE FONCTIONNE PAS
        if (data.isUserExist) {
          this.setState({
            isUserExist: true
          });
        }
      });
  }

  render() {
    if (this.state.isUserExist) {
      return <Redirect to='/Homepage' />;
    }

    return (
      <div className='FormCenter'>
        <form onSubmit={this.handleSubmit} className='FormFields'>
          <div className='FormField'>
            <input
              type='email'
              id='email'
              className='FormField__Input'
              placeholder='Enter your email'
              name='email'
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>

          <div className='FormField'>
            <input
              type='password'
              id='password'
              className='FormField__Input'
              placeholder='Enter your password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>

          <div className='FormField'>
            <button className='FormField__Button mr-20'>Sign In</button>{' '}
            <Link to='/' className='FormField__Link'>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default SignInForm;
