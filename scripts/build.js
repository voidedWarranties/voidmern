import webpack from "webpack";
import fs from "fs";

import config from "../config/webpack.prod";

const compiler = webpack(config); // Create a webpack compiler using the given config

compiler.run((err, stats) => { // Run the compiler
    if(err) {
        console.error(err);
    }
});