import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

import { Button, ClickAwayListener, Avatar, AppBar, Toolbar } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Flipcard from "@kennethormandy/react-flipcard";
import "@kennethormandy/react-flipcard/src/Flipcard.css";

import logo from "../dist/logo.png";

import "./Navigation.scss";

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
                <AppBar position="static">
                    <Toolbar>
                        <NavLink to="/" class="title-navlink">
                            <img src={ logo } style={{ width: "48px", height: "48px", margin: "4px", verticalAlign: "middle" }} />
                            <figure id="title">
                                <span>WRM</span>
                                <figcaption>
                                    Wonderland Report Manager
                                </figcaption>
                            </figure>
                        </NavLink>
                        {this.state.user ? (
                            <Flipcard flipped={ this.state.userFlipped }>
                                <div className="flip-content" onClick={ () => this.setState({ userFlipped: !this.state.userFlipped }) }>
                                    <span>
                                        <Avatar src={ this.state.user.picture } style={{ borderStyle: "solid", borderWidth: "2px", width: "32px", height: "32px", verticalAlign: "middle", display: "inline-block", margin: "8px" }} />
                                        { this.state.user.username }<sup>#{ this.state.user.discriminator }</sup>
                                    </span>
                                </div>
                                <ClickAwayListener onClickAway={ this.handleClickAway.bind(this) }>
                                    <div className="flip-content">
                                        <Button component={ Link } to="/logout" target="_self" id="logout-link">Logout</Button>
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
                this.setState({
                    user: res.data // Store the data from the response inside the state, this is the only way to set state
                });
            })
            .catch(() => {
                this.setState({
                    user: null
                });
            });
    }
}

export default Navigation;