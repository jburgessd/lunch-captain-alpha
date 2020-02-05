import { Container, Paper, Typography } from "@material-ui/core";
import firebase from "firebase";
import React from "react";

class Select extends React.Component {
  constructor(props) {
    super(props);

    let users = firebase.database().ref("Users/");
    users.once("value", snap => {
      snap.val().forEach(element => {
        if (element.email === this.props.user.email) {
          let groups = firebase.database().ref("Groups/");
          groups.once("value", arr => {
            arr.val().forEach((el, index) => {
              if (el.Name === element.groups) {
                let groupNum = index;
                let r = firebase
                  .database()
                  .ref("Groups/" + groupNum + "/Restaurants/");
                this.setState({
                  r_db: r,
                  groupNum: index
                });
                r.once("value", s => {
                  this.setState({ db: s.val() });
                });
              }
            });
          });
        }
      });
    });

    let daily = firebase.database().ref("Restaurants/");

    this.state = {
      r_db: restaurants,
      db: [],
      expanded: true,
      address: "",
      menu: "",
      name: "",
      error: null
    };
  }

  componentDidMount() {
    this.state.r_db.on("value", snapshot => {
      this.setState({ db: snapshot.val() });
    });
  }

  onNameChange = event => {
    const { value } = event.target;
    this.setState({ name: value });
  };

  onAddressChange = event => {
    const { value } = event.target;
    this.setState({ address: value });
  };

  onMenuChange = event => {
    const { value } = event.target;
    this.setState({ menu: value });
  };

  onKeyDown = event => {
    if (event.key === "Enter") {
      this.onSubmitClick();
    }
  };

  onSubmitClick = () => {
    // check to see if the Auth works.
    const { name, address, menu, db } = this.state;
    if (
      name.length <= 3 ||
      name.length >= 30 ||
      address === "" ||
      address.length <= 10 ||
      menu === " " ||
      menu === ""
    ) {
      this.setState({
        error: "Please add all required information about the restaurant"
      });
    }

    // check each restaurant address to make sure it's not in the list.
    db.forEach(restaurant => {
      if (restaurant.address.includes(address)) {
        this.setState({ error: "Restaurant is already added to the list" });
      } else {
        this.setState({ error: null });
      }
    });

    if (this.state.error === null) {
      this.setState({ name: "", address: "", menu: "" });
      firebase
        .database()
        .ref("Restaurants/" + db.length)
        .set({
          address: this.state.address,
          menu: this.state.menu,
          name: this.state.name,
          selected: 0,
          user: this.props.user.email,
          visited: 0,
          voted: 0
        });
    }
  };

  render() {
    const { db } = this.state;
    return (
      <Container component="main" maxWidth="lg">
        <Paper id="paper" elevation={3}>
          <Typography style={{ padding: "10px" }} component="h1" variant="h5">
            Today's Choices
          </Typography>
        </Paper>
      </Container>
    );
  }
}

export default Select;
