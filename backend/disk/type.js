"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = exports.UserAvatarType = void 0;
var UserAvatarType;
(function (UserAvatarType) {
    UserAvatarType[UserAvatarType["DEFAULT"] = 0] = "DEFAULT";
    UserAvatarType[UserAvatarType["URL"] = 1] = "URL";
    UserAvatarType[UserAvatarType["UPLOADED_IMAGE"] = 2] = "UPLOADED_IMAGE";
})(UserAvatarType || (UserAvatarType = {}));
exports.UserAvatarType = UserAvatarType;
var UserProvider;
(function (UserProvider) {
    UserProvider[UserProvider["EMAIL"] = 0] = "EMAIL";
    UserProvider[UserProvider["GOOGLE"] = 1] = "GOOGLE";
})(UserProvider || (UserProvider = {}));
exports.UserProvider = UserProvider;
