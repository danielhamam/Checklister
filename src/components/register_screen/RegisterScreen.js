import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import Banner from '../others/Banner';
import { registerHandler } from '../../store/database/asynchHandler'

class RegisterScreen extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
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
    const { props, state } = this;
    const { firebase } = props;
    const newUser = { ...state };
    props.register(newUser, firebase);
  }

  render() {
    const { auth, authError } = this.props;
    if (auth.uid) {
      return <Redirect to="/" />;
    }

    return (
      <div className="dashboard"> 
        <div className="container fit_nav_width">
          <div className="row row-margin">
            <div className="col s5 login-element">
              <form onSubmit={this.handleSubmit}>
                <h4 className="text-darken-3"> <b> Register </b> </h4>
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
                   <label htmlFor="firstName">First Name</label>
                   <input type="text" name="firstName" id="firstName" onChange={this.handleChange} />
                 </div>
                 <div className="input-field">
                   <label htmlFor="lastName">Last Name</label>
                   <input type="text" name="lastName" id="lastName" onChange={this.handleChange} />
                 </div>
                <div className="input-field">
                  <button type="submit" className="btn pink lighten-1 z-depth-0">Submit</button>
                  {authError ? <div className="red-text center"><p>{authError}</p></div> : null}
                </div>
              </form>
            </div> 
            <div className="col s5 offset-s2" style={{marginTop: '5%'}}>
              <Banner/>
            </div>
          </div>
        </div>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  authError: state.auth.authError,
});

const mapDispatchToProps = dispatch => ({
  register: (newUser, firebase) => dispatch(registerHandler(newUser, firebase)),
});

export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
)(RegisterScreen);