import JWT from "jsonwebtoken";
import { user } from "@prisma/client";

const JWT_SECRET_KEY = "jwt_secret_key_PASS@123";

class JWTService {
    public static async generateTokenForUser(user: user) {
        const payload = {
            id: user?.id,
            email: user?.email,
        };
        const token = JWT.sign(payload, JWT_SECRET_KEY);

        return token;
    }
}

export default JWTService;
