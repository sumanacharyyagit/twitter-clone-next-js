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
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const user_1 = __importDefault(require("../../services/user"));
const redis_1 = require("../../clients/redis");
const queries = {
    verifyGoogleToken: (parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
        const tokenValue = yield user_1.default.verifyGoogleAuthToken(token);
        return tokenValue;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                return null;
            const user = yield user_1.default.getCurrentUserById(id);
            return user;
        }
        catch (error) {
            // console.log(error, "Error");
            return null;
        }
    }),
    getUserById: (parent, { id }, ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield user_1.default.getCurrentUserById(id); }),
};
const mutations = {
    followUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!ctx.user || !ctx.user.id)
                throw new Error("Unauthenticated!");
            yield user_1.default.followUser(ctx.user.id, to);
            yield redis_1.redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
            return true;
        }
        catch (error) {
            return false;
        }
    }),
    unfollowUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!ctx.user || !ctx.user.id)
                throw new Error("Unauthenticated!");
            yield user_1.default.unfollowUser(ctx.user.id, to);
            yield redis_1.redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
            return true;
        }
        catch (error) {
            return false;
        }
    }),
};
const extraResolvers = {
    User: {
        tweets: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield db_1.prismaClient.tweet.findMany({
                where: { author: { id: parent.id } },
            });
        }),
        followers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield db_1.prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: {
                    follower: true,
                },
            });
            return res.map((el) => el.follower);
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: {
                    following: true,
                },
            });
            return res.map((el) => el.following);
        }),
        recommendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            if (!ctx.user)
                return [];
            const cachedValue = yield redis_1.redisClient.get(`RECOMMENDED_USERS:${ctx.user.id}`);
            if (cachedValue) {
                return JSON.parse(cachedValue);
            }
            const myFollowings = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: (_b = ctx === null || ctx === void 0 ? void 0 : ctx.user) === null || _b === void 0 ? void 0 : _b.id } },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following: true,
                                },
                            },
                        },
                    },
                },
            });
            const toRecommendUsers = [];
            for (const followers of myFollowings) {
                for (const followingOfFollowedUser of followers.following
                    .followers) {
                    if (followingOfFollowedUser.following.id !== ctx.user.id &&
                        myFollowings.findIndex((el) => (el === null || el === void 0 ? void 0 : el.followerId) ===
                            followingOfFollowedUser.following.id) < 0) {
                        toRecommendUsers.push(followingOfFollowedUser.following);
                    }
                }
            }
            yield redis_1.redisClient.set(`RECOMMENDED_USERS:${ctx.user.id}`, JSON.stringify(toRecommendUsers));
            return toRecommendUsers;
        }),
    },
};
exports.resolvers = { queries, extraResolvers, mutations };
