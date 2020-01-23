import {
  Button,
  Card,
  Container,
  Grid,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import firebase from "firebase";
import React from "react";

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface NewUserState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: string | null;
  validPassword: boolean;
  r_db: firebase.database.Reference;
  db: Array<User>;
}

class NewUser extends React.Component<any, NewUserState> {
  constructor(props: any) {
    super(props);
    let users = firebase.database().ref("Restaurants/");

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      validPassword: false,
      error: null,
      r_db: users,
      db: []
    };
  }

  componentDidMount() {
    this.state.r_db.once("value", snapshot => {
      this.setState({ db: snapshot.val() });
    });
  }

  onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({ firstName: value });
  };

  onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({ lastName: value });
  };

  onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({ email: value });
  };

  onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({ password: value });
    var check = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,30}$/;
    if (check.test(value)) {
      this.setState({ validPassword: true, error: null });
    } else {
      this.setState({ validPassword: false });
    }
  };

  onPasswordKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      this.onSubmitClick();
    }
  };

  onSubmitClick = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/invalid-email") {
          this.setState({ error: errorMessage, email: "" });
        } else if (errorCode === "auth/invalid-password") {
          this.setState({
            password: "",
            validPassword: false,
            error:
              errorMessage +
              "\nPassword is too weak\nPassword Must Contain at least:\n8 Characters\n1 Number\n1 lowercase letter\n1 uppercase letter"
          });
        } else {
          this.setState({ error: null });
        }
      });

    if (this.state.validPassword === true) {
      firebase
        .database()
        .ref("Users/" + this.state.db.length)
        .set({
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        });
      this.setState({ firstName: "", lastName: "", email: "", password: "" });
      this.props.changePage("login");
    } else {
      this.setState({
        password: "",
        validPassword: false,
        error:
          "Password is too weak\nPassword Must Contain at least:\n8 Characters\n1 Number\n1 lowercase letter\n1 uppercase letter"
      });
    }
  };

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Paper id="paper" elevation={3}>
          <Card id="card">
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    autoFocus={true}
                    onChange={this.onFirstNameChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    fullWidth
                    name="lastName"
                    value={this.state.lastName}
                    label="Last Name"
                    onChange={this.onLastNameChange}
                  />
                </Grid>
                <TextField
                  margin="dense"
                  fullWidth
                  name="email"
                  value={this.state.email}
                  label="Email"
                  onChange={this.onEmailChange}
                />
                <TextField
                  margin="dense"
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  onKeyDown={this.onPasswordKeyDown}
                  value={this.state.password}
                  onChange={this.onPasswordChange}
                />
              </Grid>
              <Typography
                style={{ padding: "10px" }}
                color="error"
                component="h5"
                variant="h5"
              >
                {this.state.error}
              </Typography>
              <div style={{ padding: "10px" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.onSubmitClick}
                >
                  Submit
                </Button>
              </div>
            </form>
          </Card>
        </Paper>
      </Container>
    );
  }
}

export default NewUser;
