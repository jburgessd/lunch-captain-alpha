import {
  Button,
  Card,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import firebase from "firebase";
import React from "react";

class AddRestaurant extends React.Component {
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

    let restaurants = firebase.database().ref("Restaurants/");

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
        .ref("Groups/" + this.state.groupNum + "/Restaurants/" + db.length)
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
            Current Restaurants
          </Typography>
          <TableContainer style={{ minHeight: "300px", maxHeight: "300px" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow key="header">
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Menu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {db.map(restaurant => {
                  return (
                    <TableRow key={db.indexOf(restaurant)}>
                      <TableCell>
                        <Typography variant="h6">{restaurant.name}</Typography>
                      </TableCell>
                      <TableCell>
                        {restaurant.address}
                        <IconButton
                          target="_blank"
                          href={
                            "https://www.google.com/maps/place/" +
                            restaurant.address
                          }
                        >
                          <LocationOnIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <a href={restaurant.menu} target="_blank">
                          {restaurant.menu}
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Card id="card">
            <form noValidate>
              <TextField
                margin="dense"
                fullWidth
                required
                id="name"
                label="Restaurant Name"
                name="name"
                autoFocus={true}
                value={this.state.name}
                onChange={this.onNameChange}
              />
              <TextField
                margin="dense"
                fullWidth
                required
                id="address"
                name="address"
                value={this.state.address}
                label="Restaurant Address"
                onChange={this.onAddressChange}
              />
              <TextField
                margin="dense"
                fullWidth
                required
                id="menu"
                name="menu"
                label="Restaurant Menu (Link to menu)"
                value={this.state.menu}
                onKeyDown={this.onKeyDown}
                onChange={this.onMenuChange}
              />
              {this.state.error ? (
                <Typography color="error" component="h5" variant="h6">
                  {this.state.error}
                </Typography>
              ) : null}
              <div style={{ padding: "10px" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.onSubmitClick}
                >
                  Add Restaurant
                </Button>
              </div>
            </form>
          </Card>
        </Paper>
      </Container>
    );
  }
}

export default AddRestaurant;
