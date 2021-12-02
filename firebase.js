// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import * as firebase from 'firebase';
// import 'firebase/auth';
// import 'firebase/firestore';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVPjMmQKQxkj3FP7loOL0b8OUsdgBTb0k",
  authDomain: "gifted-chat-60c9b.firebaseapp.com",
  projectId: "gifted-chat-60c9b",
  storageBucket: "gifted-chat-60c9b.appspot.com",
  messagingSenderId: "945042385753",
  appId: "1:945042385753:web:bdfba09dc356a6dedfba48"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

let app;
if(firebase.apps.length ===0){
    // app = initializeApp(firebaseConfig)
    app= firebase.initializeApp(firebaseConfig)
}else{
    app = firebase.app()
}
 const db = app.firestore();
 const auth = firebase.auth();
 export {db,auth};