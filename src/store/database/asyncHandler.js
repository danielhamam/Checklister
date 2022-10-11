import * as actionCreators from '../actions/actionCreators.js'

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      console.log("LOGIN_SUCCESS");
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });
  };

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase, firestore, registerSucceeded, registerErrored) => {
  console.log("authReducerHelpers.registerHandler: Beginning registerHandler with user: ", newUser);
  firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password,
  ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
  })).then(() => {
      registerSucceeded();
  }).catch((err) => {
      console.log("authReducerHelpers.registerHandler, error with registration: ", err.message);
      registerErrored(err.message);
  });
};