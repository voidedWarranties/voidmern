import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import Home from "./components/Home";

import { BrowserRouter as Router, Route } from "react-router-dom";

ReactDOM.render(( // Use ReactDOM (NOT REACT) to add the following JSX to the Document Object Model (DOM)
    // create a react router BrowserRouter, then Define a route for root (/) and display app inside this route
    <Router>
        <App>
            <Route path="/" component={ Home }>
            </Route>
        </App>
    </Router>
), document.querySelector("#app")); // Render the above JSX to the component in index.html with the id app