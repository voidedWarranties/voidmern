import merge from "webpack-merge";
import common from "./webpack.common";
import path from "path";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import HardSourceWebpackPlugin from "hard-source-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CompressionPlugin from "compression-webpack-plugin";

// Define some extra config options for production ONLY
const prodClientConfig = {
    mode: "production", // Set NODE_ENV to production
    devtool: "source-map",
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false
                }
            }
        }),
        new HardSourceWebpackPlugin(),
        new CompressionPlugin({
            test: /\.js$/
        })
        // new BundleAnalyzerPlugin()
    ]
};

// Define the config for the express server
const serverConfig = {
    mode: "production", // Set NODE_ENV to production
    target: "node", // Compile the bundle for node and not for the browser
    entry: "./src/server/server.js", // The entry point to the server (the backend, express)
    output: {
        path: path.join(__dirname, "../dist/server"), // Where the server bundle and related files go
        filename: "server_bundle.js" // The name of the main server bundle
    },
    node: {
        __dirname: false // Provide default behavior for __dirname (will give value somewhere in the dist folder)
    }
};

export default [ merge(common, prodClientConfig), serverConfig ]; // Merge the common client config with the production-specific config above and also add in the server config (arrays of configs are properly used by webpack when compiling)