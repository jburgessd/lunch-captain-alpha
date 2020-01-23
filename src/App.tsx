import * as firebase from "firebase/app";
import React from "react";
import AddRestaurant from "./AddRestaurant/AddRestaurant";
import Header from "./Header";
import Login from "./LandingPage/Login";
import NewUser from "./LandingPage/NewUser";

interface AppState {
  currentPage: string | null;
  user: firebase.User | null;
  username: string | null;
}

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentPage: "addRestaurant",
          user,
          username: user.displayName
        });
      }
    });
    this.state = { currentPage: "login", user: null, username: null };
  }

  changePage = (page: string) => {
    this.setState({ currentPage: page });
  };

  render() {
    if (this.state.currentPage === "addRestaurant") {
      return (
        <div>
          <Header user={this.state.user} changePage={this.changePage} />
          <AddRestaurant user={this.state.user} />
        </div>
      );
    } else if (
      this.state.currentPage === "login" ||
      this.state.currentPage === null
    ) {
      return (
        <div>
          <Header user={this.state.user} changePage={this.changePage} />
          <Login user={this.state.user} changePage={this.changePage} />
        </div>
      );
    } else if (this.state.currentPage === "signUp") {
      return (
        <div>
          <Header user={this.state.user} changePage={this.changePage} />
          <NewUser user={this.state.user} changePage={this.changePage} />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default App;
