import mongoose from "mongoose";

var userSchema = new mongoose.Schema({ // Define a new schema that requires:
    email: String, // A property called email, which is a string
    picture: String, // A property called picture, also a string
    discordID: String, // A property called discordID, a string
    username: String, // A property called username, a string
    discriminator: String, // A property called discriminator, which should probably be a number, but screw it
    loggedIn: Boolean // A property called loggedIn, a boolean
});

export default mongoose.model("User", userSchema); // Export a model made from the schema above, mongoose will call the collection "users" based on the "User" in the args