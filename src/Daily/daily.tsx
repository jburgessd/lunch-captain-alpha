import React from "react";
import ReactDOM from "react-dom";
import initializaFirebase from "../firebaseStuff";
import * as serviceWorker from "../serviceWorker";
import DailyApp from "./DailyApp";
import "./index.css";

initializaFirebase();

ReactDOM.render(<DailyApp />, document.getElementById("dailyRoot"));

serviceWorker.unregister();
