import * as firebase from "firebase/app";
import React from "react";
import Header from "../Header";
import Login from "../LandingPage/Login";
import NewUser from "../LandingPage/NewUser";
import Select from "./Select";

class DailyApp extends React.Component {
  constructor(props) {
    super(props);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user,
          username: user.displayName,
          currentPage: "select"
        });
      }
    });
    this.state = { currentPage: "login", user: null, username: null };
  }

  changePage = page => {
    this.setState({ currentPage: page });
  };

  render() {
    console.log(this.state.currentPage);
    if (this.state.currentPage === "login") {
      return (
        <div>
          <Header user={this.state.user} changePage={this.changePage} />
          <Login user={this.state.user} changePage={this.changePage} />
        </div>
      );
    } else if (this.state.currentPage === "select") {
      return (
        <div>
          <Header user={this.state.user} changePage={this.changePage} />
          <Select user={this.state.user} changePage={this.changePage} />
        </div>
      );
    } else if (this.state.currentPage === "signUp") {
      return (
        <div>
          <Header user={this.state.user} changePage={this.changePage} />
          <NewUser user={this.state.user} changePage={this.changePage} />
        </div>
      );
    }
  }
}

export default DailyApp;
