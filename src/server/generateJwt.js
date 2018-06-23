// Generate JSON Web Token (didn't call it generateJwtToken GET IT)

import jwt from "jsonwebtoken";
import config from "../config.json";

export default (user) => {
    const token = jwt.sign(user, config.session_secret, { // Use JWT to sign the user data using the secret in the config
        expiresIn: "14d", // Have it expire in 14 days
        subject: user.id // And set the subject (payload.sub) to the user id
    });

    return token; // Return the token
};