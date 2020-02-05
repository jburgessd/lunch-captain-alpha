import * as firebase from "firebase/app";
import React from "react";
import AddRestaurant from "./AddRestaurant/AddRestaurant";
import Header from "./Header";
import Login from "./LandingPage/Login";
import NewUser from "./LandingPage/NewUser";

class App extends React.Component {
  constructor(props) {
    super(props);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentPage: "addRestaurant",
          user
        });
      }
    });

    this.state = { currentPage: "login", user: null };
  }

  changePage = page => {
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
      // Make an error page eventually
      return null;
    }
  }
}

export default App;
