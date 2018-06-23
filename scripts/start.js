import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";

import config from "../config/webpack.dev";

// Options specific to the webpack-dev-server
const options = {
    contentBase: "../dist", // Serve files in the dist folder
    hot: true, // Enable hot module reloading (HMR)
    host: "localhost", // Specify a host to use
    proxy: {
        "/api": "http://localhost:3000", // Proxy requests from WDS http://host:port/api/* to express
        "/login": "http://localhost:3000", // Proxy requests from WDS http://host:port/login/* to express
        "/logout": "http://localhost:3000" // Proxy requests from WDS http://host:port/logout to express
    }
};

webpackDevServer.addDevServerEntrypoints(config, options); // Include HMR entrypoints
const compiler = webpack(config); // Create a webpack compiler using the given config
const server = new webpackDevServer(compiler, options); // Create an instance of webpack-dev-server using the compiler and the WDS-specific options

server.listen(3001, "localhost", () => { // Start the WDS
    
});