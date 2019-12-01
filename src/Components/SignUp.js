import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../Login.css';

class SignUpForm extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      firstname: '',
      lastame: '',
      hasAgreed: false,
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

    console.log('The form was submitted with the following data:', this.state);

    fetch(`http://localhost:3000/users/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `firstname=${this.state.firstname}&lastname=${this.state.lastname}&email=${this.state.email}&password=${this.state.password}`
    })
      .then(function(res, err) {
        return res.json();
      })
      .then(data => {
        console.log('Dans mon fetch -->', data);

        this.setState({
          isUserExist: true
        });
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
              type='text'
              id='firstname'
              className='FormField__Input'
              placeholder='First name'
              name='firstname'
              value={this.state.firstname}
              onChange={this.handleChange}
            />
          </div>
          <div className='FormField'>
            <input
              type='text'
              id='lastame'
              className='FormField__Input'
              placeholder='Last name'
              name='lastame'
              value={this.state.lastame}
              onChange={this.handleChange}
            />
          </div>
          <div className='FormField'>
            <input
              type='password'
              id='password'
              className='FormField__Input'
              placeholder='Password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className='FormField'>
            <input
              type='email'
              id='email'
              className='FormField__Input'
              placeholder='Email'
              name='email'
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>

          <div className='FormField'>
            <label className='FormField__CheckboxLabel'>
              <input
                className='FormField__Checkbox'
                type='checkbox'
                name='hasAgreed'
                value={this.state.hasAgreed}
                onChange={this.handleChange}
              />{' '}
              I agree all statements in{' '}
              <a
                href='http://generator.lorem-ipsum.info/terms-and-conditions'
                className='FormField__TermsLink'
              >
                terms of service
              </a>
            </label>
          </div>

          <div className='FormField'>
            <button className='FormField__Button mr-20'>Sign Up</button>{' '}
            <Link to='/sign-in' className='FormField__Link'>
              I'm already member
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
export default SignUpForm;
