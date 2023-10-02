import JWT from "jsonwebtoken";
import { user } from "@prisma/client";
import { JWTUser } from "../interfaces";

const JWT_SECRET_KEY = "jwt_secret_key_PASS@123";

class JWTService {
    public static async generateTokenForUser(user: user) {
        try {
            const payload: JWTUser = {
                id: user?.id,
                email: user?.email,
            };
            const token = JWT.sign(payload, JWT_SECRET_KEY);

            return token;
        } catch (error) {
            console.log(error, "Error");
            return null;
        }
    }

    public static decodeToken(token: string) {
        try {
            if (token.startsWith("Bearer "))
                token = token.substring(7, token.length);

            return JWT.verify(token, JWT_SECRET_KEY) as JWTUser;
        } catch (error) {
            console.log(error, "Error");
            return null;
        }
    }
}

export default JWTService;
