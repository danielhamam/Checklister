import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

import { loginHandler } from '../../store/database/asynchHandler'

class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      [target.id]: target.value,
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // As we use react-redux-firebas-v3 we need to pass firebase object to
    // authActions to be authorized by using firebse.auth method
    const { props, state } = this;
    const { firebase } = props;
    const credentials = { ...state };
    const authData = {
      firebase,
      credentials,
    };

    props.login(authData);
  }

  render() {
    const { auth, authError } = this.props;
    if (auth.uid) {
      return <Redirect to="/" />;
    }

    return (
      <div id="login-dashboard"> 
        <div className="container" style={{width: '91%'}}>
          <div className="row">
            <div className="col s5 login-element">
              <form onSubmit={this.handleSubmit}>
                <h4 className="text-darken-3"> <b> Login </b> </h4>
                <br/>
                <div className="input-field">
                  <label htmlFor="email">Email</label>
                  <input className="active" type="email" name="email" id="email" onChange={this.handleChange} />
                </div>
                <div className="input-field">
                  <label htmlFor="password">Password</label>
                  <input className="active" type="password" name="password" id="password" onChange={this.handleChange} />
                </div>
                <div className="input-field">
                  <button type="submit" className="btn pink lighten-1 z-depth-0">Login</button>
                  {authError ? <div className="red-text center"><p>{authError}</p></div> : null}
                </div>
              </form>
            </div> 
            <div className="col s5 offset-s2 login-element">
              <div className='banner'> 
                <p style={{fontSize:'3.9vw'}}>
                  <span>Checklister&trade;</span>
                  <br/>
                  <span style={{fontSize:'1.8vw'}}>Easy, Customizable and Fun </span>
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

const mapDispatchToProps = dispatch => ({
  login: authData => dispatch(loginHandler(authData)),
});

// We need firebaseConnect function to provide to this component
// firebase object with auth method.
// You can find more information on the link below
// http://docs.react-redux-firebase.com/history/v3.0.0/docs/auth.html

export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(LoginScreen);