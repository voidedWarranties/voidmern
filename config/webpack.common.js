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
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.(js|jsx)$/, // Regex (REGular EXpression) that allows both .js and .jsx
                exclude: /node_modules/, // Exclude node_modules from being loaded by babel
                loader: "babel-loader"
            },
            {
                test: /\.css$/, // Load css files from external libraries, or my own
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 8192
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