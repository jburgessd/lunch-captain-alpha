import * as firebase from "firebase/app";
import React from "react";
import Header from "../Header";
import Login from "../LandingPage/Login";

interface DailyAppState {
  currentPage: string | null;
  user: firebase.User | null;
  username: string | null;
}

class DailyApp extends React.Component<any, DailyAppState> {
  constructor(props: any) {
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

  changePage = (page: string) => {
    this.setState({ currentPage: page });
  };

  render() {
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
          <Login user={this.state.user} changePage={this.changePage} />
        </div>
      );
    }
  }
}

export default DailyApp;
