import {
  Button,
  Card,
  Container,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import firebase from "firebase";
import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: null };
  }

  onSubmitClick = () => {
    // check to see if the Auth works.
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/invalid-email") {
          this.setState({ error: "Email is invalid" });
        } else if (errorCode === "auth/invalid-password") {
          this.setState({
            error:
              "Password is too weak\nPassword Must Contain at least:\n8 Characters\n1 Number\n1 lowercase letter\n1 uppercase letter"
          });
        } else {
          this.setState({ error: null });
        }
      });
    if (this.props.user) {
      this.props.changePage("addRestaurant");
    }
  };

  onSignupClick = () => {
    // open the signup page
    this.props.changePage("signUp");
  };

  onEmailChange = event => {
    const { value } = event.target;
    this.setState({ email: value });
  };

  onPasswordChange = event => {
    const { value } = event.target;
    this.setState({ password: value });
  };

  onPasswordKeyDown = event => {
    if (event.key === "Enter") {
      this.onSubmitClick();
    }
  };

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Paper id="paper" elevation={3}>
          <Card id="card">
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form noValidate>
              <TextField
                margin="dense"
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus={true}
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
              <div style={{ padding: "10px" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.onSignupClick}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </Card>
        </Paper>
      </Container>
    );
  }
}

export default Login;
