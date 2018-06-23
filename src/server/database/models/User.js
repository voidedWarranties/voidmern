import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
    email: String,
    picture: String,
    discordID: String,
    username: String,
    discriminator: String,
    loggedIn: Boolean
});

export default mongoose.model("User", userSchema);