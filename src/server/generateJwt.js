// Generate JSON Web Token (didn't call it generateJwtToken GET IT)

import jwt from "jsonwebtoken";
import config from "../config.json";

export default (user) => {
    const token = jwt.sign(user, config.session_secret, {
        expiresIn: "14d",
        subject: user.id
    });

    return token;
};