import { AppBar, Button, Toolbar } from "@material-ui/core";
import firebase from "firebase";
import React from "react";

interface HeaderState {}

class Header extends React.Component<any, HeaderState> {
  constructor(props: any) {
    super(props);
  }

  onLogClick = () => {
    if (this.props.user !== null) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("User Signed out");
        })
        .catch(error => {
          console.log(error);
        });
      this.props.changePage("login");
    } else {
      this.props.changePage("login");
    }
  };

  render() {
    return (
      <AppBar style={{ minHeight: "50px" }} position="sticky">
        <Toolbar>
          <a
            style={{ color: "white" }}
            href="https://github.com/jburgessd/lunch-captain-alpha/issues"
            target="_blank"
          >
            Submit Bugs or Feature Requests
          </a>
          <div style={{ flex: 1 }} />
          <Button
            type="reset"
            size="small"
            color="inherit"
            onClick={this.onLogClick}
          >
            {this.props.user ? "LOGOUT" : "LOGIN"}
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
