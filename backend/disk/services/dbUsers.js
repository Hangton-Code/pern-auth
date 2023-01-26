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
exports.editProfile = exports.getProfileByIds = exports.setPassword = exports.editRefreshToken = exports.signUp = exports.getUserByEmail = exports.getUserById = void 0;
const db_1 = __importDefault(require("../db"));
const type_1 = require("../type");
const bcrypt_1 = __importDefault(require("bcrypt"));
// for auth
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryString = "select * from users where id = $1";
        const values = [id];
        const user = yield db_1.default.query(queryString, values).then((result) => {
            return result.rows.length ? result.rows[0] : null;
        });
        return user;
    });
}
exports.getUserById = getUserById;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryString = "select * from users where email = $1";
        const values = [email];
        const user = yield db_1.default
            .query(queryString, values)
            .then((result) => (result.rows.length ? result.rows[0] : null));
        return user;
    });
}
exports.getUserByEmail = getUserByEmail;
function signUp(email, password, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const processedPassword = password ? yield bcrypt_1.default.hash(password, 10) : null;
        const queryString = "insert into users (email, password, provider) values ($1, $2, $3) returning *";
        const values = [email, processedPassword, provider || type_1.UserProviderType.EMAIL];
        return yield db_1.default
            .query(queryString, values)
            .then((result) => result.rows[0]);
    });
}
exports.signUp = signUp;
function editRefreshToken(refresh_token, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryString = "update users set refresh_token = $1 where id = $2";
        const values = [refresh_token, id];
        yield db_1.default.query(queryString, values);
    });
}
exports.editRefreshToken = editRefreshToken;
function setPassword(password, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const processedPassword = yield bcrypt_1.default.hash(password, 10);
        const queryString = "update users set password = $1 where id = $2";
        const values = [processedPassword, id];
        yield db_1.default.query(queryString, values);
    });
}
exports.setPassword = setPassword;
// for profile
function getProfileByIds(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryString = // in sql, rows = array, [] != array. And, id = array = rows. Therefore, ANY works, IN does not work
         "select id, user_name, user_avatar_type, user_avatar_content, signuped_at from users where id = ANY($1)";
        const values = [id];
        return (yield db_1.default.query(queryString, values)).rows;
    });
}
exports.getProfileByIds = getProfileByIds;
function editProfile({ user_name, user_avatar_type, user_avatar_content, id, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user_name && !user_avatar_type && !user_avatar_content)
            return;
        const queryString = `update users set user_name = $1, user_avatar_type = $2, user_avatar_content = $3 where id = $4`;
        const values = [user_name, user_avatar_type, user_avatar_content, id];
        yield db_1.default.query(queryString, values);
    });
}
exports.editProfile = editProfile;
