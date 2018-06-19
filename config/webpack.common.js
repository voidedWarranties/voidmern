import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const clientConfig = {
    entry: "./src/client/index.js", // The entry point to the client (the main file for the client)
    output: {
        path: path.join(__dirname, "../dist/client"), // Where the client bundle and related files (index.html) go
        filename: "index_bundle.js" // The name of the main client bundle
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Regex (REGular EXpression) that allows both .js and .jsx
                exclude: /node_modules/, // Exclude node_modules from being loaded by babel
                use: {
                    loader: "babel-loader" // Use the loader babel-loader
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"] // File extensions to automatically resolve
    },
    plugins: [
        new HtmlWebpackPlugin({ // Use webpack to create a HTML file,
            template: "./src/client/index.html" // Based on the template in this folder
        })
    ]
}

export default clientConfig;