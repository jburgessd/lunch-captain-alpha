import * as firebase from "firebase/app";
import "firebase/auth";

const initializaFirebase = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyDEI4YpjuL8pcGez4uZDvIDve-prrDexwU",
    authDomain: "lunch-captain-alpha.firebaseapp.com",
    databaseURL: "https://lunch-captain-alpha.firebaseio.com",
    projectId: "lunch-captain-alpha",
    storageBucket: "lunch-captain-alpha.appspot.com",
    messagingSenderId: "433533067955",
    appId: "1:433533067955:web:a8ff7567d537f5956246c6",
    measurementId: "G-099RC8WFTC"
  };

  firebase.initializeApp(firebaseConfig);
};

export default initializaFirebase;
