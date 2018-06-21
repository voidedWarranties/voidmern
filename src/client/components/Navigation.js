import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";

import { Button, ClickAwayListener, Avatar, AppBar, Toolbar, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Flipcard from "@kennethormandy/react-flipcard";
import "@kennethormandy/react-flipcard/src/Flipcard.css";

import "./Navigation.scss";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    }
});

class Navigation extends Component { // Create a component Navigation based on react's base Component - Only class-based components can store state, not function-based components
    constructor(props) {
        super(props);
        this.state = { 
            user: {},
            userFlipped: false
        }; // Set the default state for this component
    }

    render() { // Called by react to render the component, must return JSX
        return (
            <div id="navigation">
                <CssBaseline />
                <AppBar style={{ padding: "16px" }} position="static">
                    <Toolbar>
                        {this.state.user ? (
                            <Flipcard flipped={ this.state.userFlipped }>
                                <div className="flip-content" onClick={ e => this.setState({ userFlipped: !this.state.userFlipped }) }>
                                    <span>
                                        <Avatar src={"https://cdn.discordapp.com/avatars/" + this.state.user.id + "/" + this.state.user.avatar + ".png"} style={{ borderStyle: "solid", borderWidth: "2px", width: "32px", height: "32px", verticalAlign: "middle", display: "inline-block", margin: "8px" }} />
                                        { this.state.user.username }<sup>#{ this.state.user.discriminator }</sup>
                                    </span>
                                </div>
                                <ClickAwayListener onClickAway={ this.handleClickAway.bind(this) } className="flip-content">
                                    <div>
                                        <Button component={ Link } to="/logout" target="_self" id="logout-link" style={ styles.button }>Logout</Button>
                                    </div>
                                </ClickAwayListener>
                            </Flipcard>
                            ) : (
                                <Button component={ Link } to="/login" target="_self" id="login-link">Login</Button>
                            )
                        }
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    handleClickAway() {
        if(this.state.userFlipped) {
            this.setState({
                userFlipped: false
            });
        }
    }

    componentDidMount() {
        axios.get("/api/user") // Use axios to get the user from express
            .then(res => {
                console.log(res.data);
                this.setState({
                    user: res.data ? res.data : null // Store the data from the response inside the state, this is the only way to set state
                });
            })
            .catch(err => {
                console.error(err); // Log any errors into the developer console, since this is code for the browser. This does not output to the terminal.
            });
    }
}

export default withStyles(styles)(Navigation);