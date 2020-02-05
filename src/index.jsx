import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import initializaFirebase from "./firebaseStuff";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

initializaFirebase();

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
