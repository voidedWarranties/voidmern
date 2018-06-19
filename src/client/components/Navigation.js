import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

class Navigation extends Component { // Create a component Navigation based on react's base Component - Only class-based components can store state, not function-based components
    constructor(props) {
        super(props);
        this.state = { user: {} }; // Set the default state for this component
    }

    render() { // Called by react to render the component, must return JSX
        return (
            <div>
                <span>{ JSON.stringify(this.state.user) } </span> {/* Add a span containing the state named user as a string */}
                <Link to="/login" target="_self">Login</Link> {/* Add a Link (react router) that links to /login (express) and uses target="_self" to properly link to express */}
            </div>
        );
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

export default Navigation;