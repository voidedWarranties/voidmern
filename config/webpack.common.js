import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";

const clientConfig = {
    entry: "./src/client/index.js", // The entry point to the client (the main file for the client)
    output: {
        path: path.join(__dirname, "../dist/client"), // Where the client bundle and related files (index.html) go
        filename: "index_bundle.js" // The name of the main client bundle
    },
    module: {
        rules: [
            {
                enforce: "pre", // Make sure this loader comes first
                test: /\.(js|jsx)$/, // Allow .js and .jsx extensions
                exclude: /node_modules/, // Exclude the node_modules folder
                loader: "eslint-loader" // Use the eslint-loader to detect settings from the .eslintrc.json and produce errors for non-standard code
            },
            {
                test: /\.(js|jsx)$/, // Regex (REGular EXpression) that allows both .js and .jsx
                exclude: /node_modules/, // Exclude node_modules from being loaded by babel
                loader: "babel-loader" // Use the babel-loader to convert files from es6(+) to commonjs (es5)
            },
            {
                test: /\.css$/, // Load css files from external libraries, or my own
                use: [
                    "style-loader", // Inject CSS into the DOM
                    "css-loader" // Translate CSS to CommonJS
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/, // Allow .png, .jpg, .gif, .woff, and .woff2 extensions to be loaded
                loader: "url-loader", // Use url-loader to load files similarly to file-loader
                options: {
                    limit: 8192 // Define a byte limit. If passed, the loader will instead use a DataURL.
                }
            },
            {
                test: /\.scss$/, // Load scss files
                use: [
                    "style-loader", // Inject CSS to the DOM
                    "css-loader", // Translate CSS to CommonJS
                    "sass-loader" // Transpile SASS to CSS
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"] // File extensions to automatically resolve
    },
    plugins: [
        new HtmlWebpackPlugin({ // Use webpack to create a HTML file,
            template: "./src/client/index.html" // Based on the template in this folder
        }),
        new FaviconsWebpackPlugin("./src/client/dist/logo.png")
    ]
};

export default clientConfig;