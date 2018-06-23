import React, { Component } from "react";
import PropTypes from "prop-types";

import Navigation from "./Navigation";

class App extends Component { //  Create a component App based on react's base Component
    constructor(props) {
        super(props);
    }

    render() { // Called by react to render the component, must return JSX
        return(
            <div>
                <Navigation /> {/* Add an instance of the Navigation component */}
                { this.props.children } {/* Insert the components inside this component */}
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.element.isRequired // Define that the prop children is required (children is the components inside this one)
};

export default App;