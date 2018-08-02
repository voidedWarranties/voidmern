import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

import { Button, ClickAwayListener, Avatar, AppBar, Toolbar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, IconButton } from "@material-ui/core";
import { ChatBubble, Forum, Delete } from "@material-ui/icons";
import CssBaseline from "@material-ui/core/CssBaseline";
import Flipcard from "@kennethormandy/react-flipcard";
import "@kennethormandy/react-flipcard/src/Flipcard.css";

import logo from "../dist/logo.png";

import "./Navigation.scss";

class LoginDialog extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);
    }

    handleClose() {
        this.props.onClose(this.props.selectedValue);
    }

    handleListItemClick(value) {
        this.props.onClose(value);
    }

    render() {
        // const { classes, onClose, selectedValue, ...other } = this.props; // eslint-disable-line no-unused-vars

        return (
            <Dialog onClose = { this.handleClose } aria-labelledby="login-dialog-title" open = { this.props.open }>
                <DialogTitle id="login-dialog-title">Login with...</DialogTitle>
                <div>
                    <List>
                        <ListItem button onClick={() => this.handleListItemClick("discord")} component={ Link } to="/api/kakao/login" target="_self">
                            <ListItemAvatar>
                                <Avatar>
                                    <ChatBubble />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary = "Kakao" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleListItemClick("discord")} component={ Link } to="/api/discord/login" target="_self">
                            <ListItemAvatar>
                                <Avatar>
                                    <Forum />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary = "Discord" />
                        </ListItem>
                    </List>
                </div>
            </Dialog>
        );
    }
}

LoginDialog.propTypes = {
    // classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
    open: PropTypes.bool
};

class Navigation extends Component { // Create a component Navigation based on react's base Component - Only class-based components can store state, not function-based components
    constructor(props) {
        super(props);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = { 
            user: {}, // Empty user by defualt
            userFlipped: false, // The user "card" is unflipped by default
            open: false,
            selectedValue: ""
        }; // Set the default state for this component
    }

    render() { // Called by react to render the component, must return JSX
        return (
            <div id="navigation">
                <CssBaseline /> {/* Use the baseline CSS from material-ui */}
                <AppBar position="static"> {/* Create a MUI app bar */}
                    <Toolbar> {/* Create a MUI toolbar inside the app bar */}
                        <NavLink to="/" className="title-navlink"> {/* Create a navlink */}
                            <img src={ logo } style={{ width: "48px", height: "48px", margin: "4px", verticalAlign: "middle" }} /> {/* Which has the WRM "logo" in it */}
                            <figure id="title"> {/* Use a trick with figures */}
                                <span>CTY</span>
                                <figcaption> {/* To have this text under the main "WRM" text */}
                                    2018 Session 1 & 2
                                </figcaption>
                            </figure>
                        </NavLink>
                        {this.state.user ? (
                            <div>
                                <Flipcard flipped={ this.state.userFlipped }>
                                    <div className="flip-content" onClick={ () => this.setState({ userFlipped: !this.state.userFlipped }) }>
                                        <span>
                                            <Avatar src={ this.state.user.picture } style={{ borderStyle: "solid", borderWidth: "2px", width: "32px", height: "32px", verticalAlign: "middle", display: "inline-block", margin: "8px" }} />
                                            { this.state.user.username }<sup>{ this.state.user.loggedIn == "discord" ? "#" + this.state.user.discriminator : "Kakao" }</sup>
                                        </span>
                                    </div>
                                    <ClickAwayListener onClickAway={ this.handleClickAway.bind(this) }>
                                        <div className="flip-content">
                                            <Button component={ Link } to="/api/logout" target="_self" id="logout-link">Logout</Button>
                                            <IconButton style={{ width: "32px", height: "32px" }} component={ Link } to={ "/api/account/delete/" + this.state.user.email } target="_self">
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </ClickAwayListener>
                                </Flipcard>
                            </div>
                        ) : (
                            // <Button component={ Link } to="/login" target="_self" id="login-link">Login</Button>
                            <div>
                                <Button onClick={ this.handleClickOpen } id="login-link">Login</Button>
                                <LoginDialog selectedValue = { this.state.selectedValue } open = { this.state.open } onClose = { this.handleClose } />
                            </div>
                        )
                        }
                    </Toolbar>
                </AppBar>
            </div>
        ); // AFTER THE NAVLINK: The Flipcard is a custom element which has 2 sides, in this case, the div and the ClickAwayListener (disappears in the page, so it is the div under that)
        // When front side is clicked, it flips the card over, and when you click out of that (ClickAwayListener), the card flips back
    }

    handleClickAway() { // Called when the user clicks away from a certain area. See, ClickAwayListener
        if(this.state.userFlipped) { // If the user card is already flipped,
            this.setState({
                userFlipped: false // Unflip it
            });
        }
    }

    handleClose(value) {
        this.setState({ selectedValue: value, open: false });
    }

    handleClickOpen() {
        this.setState({
            open: true
        });
    }

    componentDidMount() {
        axios.get("/api/user") // Use axios to get the user from express
            .then(res => {
                this.setState({
                    user: res.data // Store the data from the response inside the state, this is the only way to set state
                });
            })
            .catch(() => { // If we get a 401 / other error
                this.setState({
                    user: null // Set no user
                });
            });
    }
}

export default Navigation;