import mongoose from "mongoose";
import config from "../../config.json";

const init = () => mongoose.connect(config.database_url); // Create a function that connects to the MongoDB
const getConnection = () => { return mongoose.connection; }; // Create a function that returns the MongoDB connection

export { init, getConnection }; // Export both of the above functions, so they can be imported like 'import { init, getConnection} from "driver"'