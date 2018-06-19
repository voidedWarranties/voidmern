import merge from "webpack-merge";
import common from "./webpack.common";
import webpack from "webpack";

// Define some extra config options for development (npm start) ONLY
const devClientConfig = {
    mode: "development", // Set NODE_ENV to development
    devtool: "inline-source-map", // Make it so errors link to the correct source file instead of a place in the build file (slows build process)
    plugins: [
        new webpack.NamedModulesPlugin(), // Show path of module with hot module reloading
        new webpack.HotModuleReplacementPlugin() // Allow hot module reloading (reloading when pressing CTRL+S in the client [react] files)
    ]
};

// Use babel-watch in development for express
export default merge(common, devClientConfig); // Merge common client config with the development-specific config above