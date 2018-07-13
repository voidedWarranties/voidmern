import React, { Component } from "react";

import {  } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./Home.scss";

class Home extends Component {
    render() {
        return(
            <div id="home">
                <CssBaseline />
                <h1>WRM by voided - inspired by Alice’s Wonderland</h1>
            </div>
        );
    }
}

export default Home;