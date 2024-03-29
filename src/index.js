/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';

import './css/shared.css'
import './css/navbar.css'
import './css/home_screen.css'
import './css/login_screen.css'
import './css/register_screen.css'
import './css/list_screen.css'
import './css/admin_screen.css'
import './css/task_screen.css'
// import * as serviceWorker from './serviceWorker';

import ReactReduxFirebaseApp from './store/ReactReduxFirebaseApp'

ReactDOM.render(
  <ReactReduxFirebaseApp />, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();