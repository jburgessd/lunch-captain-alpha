import "firebase/auth";
import React from "react";
import ReactDOM from "react-dom";
import initializaFirebase from "../firebaseStuff";
import * as serviceWorker from "../serviceWorker";
import DailyApp from "./DailyApp";
import "./index.css";

initializaFirebase();

ReactDOM.render(<DailyApp />, document.getElementById("dailyRoot"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
