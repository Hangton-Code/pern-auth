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
exports.getAvatarController = exports.editAvatarController = exports.editProfileController = exports.getProfileController = void 0;
const errorHandler_1 = require("../helpers/errorHandler");
const dbUsers_1 = require("../services/dbUsers");
const s3Avatar_1 = require("../services/s3Avatar");
const type_1 = require("../type");
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
// function that delete file from uploads
const unlinkFile = util_1.default.promisify(fs_1.default.unlink);
function getProfileController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const requested_id = req.params.requested_id;
        const user = (yield (0, dbUsers_1.getProfileByIds)([requested_id]))[0];
        res.json({
            message: "success",
            body: {
                data: user,
            },
        });
    });
}
exports.getProfileController = getProfileController;
function editProfileController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, dbUsers_1.editProfile)(Object.assign(Object.assign({}, req.user), req.body));
        res.json({
            message: "success",
        });
    });
}
exports.editProfileController = editProfileController;
function editAvatarController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let requested_avatar_type = req.body.avatar_type;
        const file = req.file;
        // to prevent file is uploaded but requesting to set other (0 or 1)
        if (file)
            requested_avatar_type = type_1.UserAvatarType.UPLOADED_IMAGE;
        // if requested avatar type is not declared (0,1,2 => UserAvatarType)
        if (![0, 1, 2].includes(requested_avatar_type)) {
            throw new errorHandler_1.APIError("Avatar Type Is Not Declared", {
                statusCode: 400,
            });
        }
        // delete uploaded avatar
        const user_avatar_type = req.user.user_avatar_type;
        if (user_avatar_type === type_1.UserAvatarType.UPLOADED_IMAGE) {
            const key = req.user.user_avatar_content;
            yield (0, s3Avatar_1.deleteAvatar)(key);
        }
        // response value
        let new_user_avatar_content = "";
        // set avatar
        switch (requested_avatar_type) {
            case type_1.UserAvatarType.DEFAULT:
                yield (0, dbUsers_1.editProfile)(Object.assign(Object.assign({}, req.user), { user_avatar_type: type_1.UserAvatarType.DEFAULT, user_avatar_content: null }));
                new_user_avatar_content = null;
                break;
            case type_1.UserAvatarType.URL:
                const avatar_url = req.body.avatar_url;
                if (!avatar_url)
                    throw new errorHandler_1.APIError("Avatar Url Is Required", {
                        statusCode: 400,
                    });
                yield (0, dbUsers_1.editProfile)(Object.assign(Object.assign({}, req.user), { user_avatar_type: type_1.UserAvatarType.URL, user_avatar_content: avatar_url }));
                new_user_avatar_content = avatar_url;
                break;
            case type_1.UserAvatarType.UPLOADED_IMAGE:
                if (!file)
                    throw new errorHandler_1.APIError("Image File Is Required", {
                        statusCode: 400,
                    });
                const { Key } = yield (0, s3Avatar_1.uploadAvatar)(file);
                yield (0, dbUsers_1.editProfile)(Object.assign(Object.assign({}, req.user), { user_avatar_type: type_1.UserAvatarType.UPLOADED_IMAGE, user_avatar_content: Key }));
                yield unlinkFile(file.path);
                new_user_avatar_content = Key;
                break;
        }
        res.json({
            message: "success",
            body: {
                new_user_avatar_type: requested_avatar_type,
                new_user_avatar_content,
            },
        });
    });
}
exports.editAvatarController = editAvatarController;
function getAvatarController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const Key = req.params.key;
        const readStream = (0, s3Avatar_1.getAvatarFileStream)(Key);
        readStream.pipe(res);
    });
}
exports.getAvatarController = getAvatarController;
