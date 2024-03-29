import * as actionCreators from '../actions/actionCreators.js'
import { constants } from '../../constants'

export const loginHandler = (credentials, firebase, loginSucceeded, loginErrored) => {
  console.log("authReducerHelpers.loginHandler: Beginning loginHandler for credentials: ", credentials);
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      console.log("LOGIN_SUCCESS");
      loginSucceeded();
    }).catch((err) => {
      console.log("authReducerHelpers.loginHandler, error with login: ", err.message);
      loginErrored(err.message);
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
  ).then((resp) => {
  firestore.collection('accounts').doc(resp.user.uid).set({
      administrator : false,
      created_time: new Date().toLocaleString()
    }).then(() => {
      firestore.collection('accounts').doc(resp.user.uid).collection('checklists').add(constants.newChecklist);
      })
  }).then(() => {
    registerSucceeded();
  }).catch((err) => {
      console.log('authReducerHelpers.registerHandler, error with registration: ', err.message);
      registerErrored(err.message);
  });
};