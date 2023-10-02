"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET_KEY = "jwt_secret_key_PASS@123";
class JWTService {
    static generateTokenForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    id: user === null || user === void 0 ? void 0 : user.id,
                    email: user === null || user === void 0 ? void 0 : user.email,
                };
                const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET_KEY);
                return token;
            }
            catch (error) {
                console.log(error, "Error");
                return null;
            }
        });
    }
    static decodeToken(token) {
        try {
            if (token.startsWith("Bearer "))
                token = token.substring(7, token.length);
            return jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        }
        catch (error) {
            console.log(error, "Error");
            return null;
        }
    }
}
exports.default = JWTService;
