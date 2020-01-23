import * as firebase from "firebase/app";
import React from "react";

interface DailyAppState {
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
          username: user.displayName
        });
      }
    });
    this.state = { user: null, username: null };
  }

  componentDidMount() {}

  render() {
    return null;
  }
}

export default DailyApp;
