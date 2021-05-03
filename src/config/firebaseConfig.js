import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
// (ADDED)
var firebaseConfig = {
    apiKey: "AIzaSyB9Zb6NNKyftnjXeUu5OAwwGaCcNCxeG8I",
    authDomain: "todohw3-fc532.firebaseapp.com",
    databaseURL: "https://todohw3-fc532.firebaseio.com",
    projectId: "todohw3-fc532",
    storageBucket: "todohw3-fc532.appspot.com",
    messagingSenderId: "773473334120",
    appId: "1:773473334120:web:a08996436e21cb4e165cdd",
    measurementId: "G-86BQ00J742"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;