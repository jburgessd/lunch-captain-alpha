import {
  Button,
  ButtonGroup,
  Card,
  ClickAwayListener,
  Container,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  Typography
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import firebase from "firebase";
import React from "react";

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface Groups {
  Name: string;
}

interface NewUserState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: string | null;
  validPassword: boolean;
  u_db: firebase.database.Reference;
  g_db: firebase.database.Reference;
  db: Array<User>;
  groups: Array<string>;
  group_sel: string;
  buttonEl: React.RefObject<HTMLDivElement>;
  popout_open: boolean;
}

class NewUser extends React.Component<any, NewUserState> {
  constructor(props: any) {
    super(props);
    let users = firebase.database().ref("Users/");
    let groups = firebase.database().ref("Groups/");

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      validPassword: false,
      error: null,
      u_db: users,
      g_db: groups,
      db: [],
      groups: [],
      group_sel: "",
      buttonEl: React.useRef<HTMLDivElement>(null),
      popout_open: false
    };
  }

  componentDidMount() {
    this.state.u_db.once("value", snapshot => {
      this.setState({ db: snapshot.val() });
    });
    this.state.g_db.once("value", snapshot => {
      let tmp: string[] = ["No Group"];
      snapshot.val().forEach((index: Groups) => {
        tmp.push(index.Name);
      });
      tmp.push("New Group");
      this.setState({ groups: tmp, group_sel: tmp[0] });
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
          lastName: this.state.lastName,
          groups: this.state.group_sel
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

  handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    this.setState({ group_sel: this.state.groups[index], popout_open: false });
  };

  handleToggle = () => {
    this.setState({ popout_open: !this.state.popout_open });
  };

  handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    this.setState({ popout_open: false });
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
              <Grid container spacing={2} alignItems="center">
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
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    fullWidth
                    name="email"
                    value={this.state.email}
                    label="Email"
                    onChange={this.onEmailChange}
                  />
                </Grid>
                <Grid item xs={12}>
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
                <Typography variant="h6">Group</Typography>
                <Grid item xs={12}>
                  <ButtonGroup
                    ref={this.state.buttonEl}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    <Button>{this.state.group_sel}</Button>
                    <Button
                      onClick={this.handleToggle}
                      style={{ flex: 1 }}
                      size="small"
                    >
                      <ArrowDropDown />
                    </Button>
                  </ButtonGroup>
                  <Popper
                    open={this.state.popout_open}
                    anchorEl={this.state.buttonEl.current}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === "bottom"
                              ? "center top"
                              : "center bottom"
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList id="split-button-menu">
                              {this.state.groups.map((option, index) => (
                                <MenuItem
                                  key={option}
                                  onClick={event =>
                                    this.handleMenuItemClick(event, index)
                                  }
                                >
                                  {option}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Grid>
                {this.state.error ? (
                  <Grid item xs={12}>
                    <Typography color="error" component="h5" variant="h5">
                      {this.state.error}
                    </Typography>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={this.onSubmitClick}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Paper>
      </Container>
    );
  }
}

export default NewUser;
