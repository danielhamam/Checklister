import * as actionCreators from '../actions/actionCreators'

// REDUCERS ARE CALLED WHEN AN ACTION IS DISPATCHED,
// THEIR JOB IS TO ADVANCE THE STATE. THEY WILL UPDATE
// AND RETURN THE NEW, UPDATED STATE

const initState = {
  authError: '',
  loggedOutLink : ''
};

const authReducer = (state = initState, action) => {
  console.log("authReducer: Beginning mapping of type " + action.type + " to corresponding handler");
  switch (action.type) {
    case actionCreators.RESET_AUTH_ERROR:
      return {
        ...state,
        authError: ''
      };
    case actionCreators.LOGGED_OUT_LINK_CHANGED:
      return {
        ...state,
        loggedOutLink: action.loggedOutLink
      };
    case actionCreators.REGISTER_SUCCEEDED:
      return {
        ...state,
        // user : action.user, // commented out - user object is available via firebase.auth
        authError: ''   
      };
    case actionCreators.REGISTER_ERRORED:
      // console.log("Mapped to Register Errored with message: ", action.error)
      return {
        ...state,
        authError: action.error     
      };
    case actionCreators.LOGIN_ERRORED:
      return {
        ...state,
        authError: action.error
      };
    case actionCreators.LOGIN_SUCCEEDED:
      return {
        ...state,
        authError: '',
      };
    // case actionCreators.LOGOUT_SUCCEEDED:
    //   return state;
    default:
      return state;
  }
};

export default authReducer;