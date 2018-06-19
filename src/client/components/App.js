import React, { Component } from "react";

import Navigation from "./Navigation";

class App extends Component { //  Create a component App based on react's base Component
    render() { // Called by react to render the component, must return JSX
        return(
            <div>
                <Navigation /> {/* Add an instance of the Navigation component */}
                { this.props.children } {/* Insert the components inside this component */}
            </div>
        );
    }
}

export default App;