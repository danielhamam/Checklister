// THIS FILE KNOWS HOW TO MAKE ALL THE ACTION
// OBJECDTS THAT WE WILL USE. ACTIONS ARE SIMPLE
// LITTLE PACKAGES THAT REPRESENT SOME EVENT
// THAT WILL BE DISPATCHED TO THE STORE, WHICH
// WILL TRIGGER THE EXECUTION OF A CORRESPONDING
// REDUCER, WHICH ADVANCES STATE

// THESE ARE ALL THE TYPE OF ACTIONS WE'LL BE CREATING
// export const REGISTER_STARTED = 'REGISTER_STARTED';
export const REGISTER_SUCCEEDED = 'REGISTER_SUCCEEDED';
export const REGISTER_ERRORED = 'REGISTER_ERRORED';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
export const LOGIN_ERRORED = 'LOGIN_ERRORED';
export const LOGGED_OUT_LINK_CHANGED = 'LOGGED_OUT_LINK_CHANGED';
export const RESET_AUTH_ERROR = 'RESET_AUTH_ERROR';

// THESE CREATORS MAKE ACTIONS ASSOCIATED WITH USER ACCOUNTS

/*********************************************************************
* PURPOSE: When called, returns object with required information
* WHERE IS IT USED?: Used in mapDispatchtoProps
************************************************************************/
export const showLinkOnNavbar = (link) => {
    console.log("HERE with", link);
    return { 
        type: LOGGED_OUT_LINK_CHANGED,
        loggedOutLink : link
    }
};

export const resetAuthError = () => {
    return { 
        type: RESET_AUTH_ERROR,
        error: ''
    }
};
export const registerSucceeded = () => {
    return { 
        type: REGISTER_SUCCEEDED,
        // user: newUser
    }
};
export function registerErrored(error) { 
    console.log("Registering register errored function, attaching error: ", error);
    return { 
        type: REGISTER_ERRORED, 
        error : error
    }
};
export function loginSucceeded() {
    return { 
        type: LOGIN_SUCCEEDED 
    }
};
export function loginErrored(error) {
    return { 
        type: LOGIN_ERRORED, 
        error : error
    }
};
export function logoutSuccess() {
    return { type: 'LOGOUT_SUCCESS' }
};

// // THESE CREATORS MAKE ACTIONS FOR ASYNCHRONOUS TODO LIST UPDATES
// export function createTodoList(todoList) {
//     return {
//         type: 'CREATE_TODO_LIST',
//         todoList
//     }
// }
// export function createTodoListError(error) {
//     return {
//         type: 'CREATE_TODO_LIST_ERROR',
//         error
//     }
// }