"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProviderType = exports.UserAvatarType = void 0;
var UserAvatarType;
(function (UserAvatarType) {
    UserAvatarType[UserAvatarType["DEFAULT"] = 0] = "DEFAULT";
    UserAvatarType[UserAvatarType["URL"] = 1] = "URL";
    UserAvatarType[UserAvatarType["UPLOADED_IMAGE"] = 2] = "UPLOADED_IMAGE";
})(UserAvatarType || (UserAvatarType = {}));
exports.UserAvatarType = UserAvatarType;
var UserProviderType;
(function (UserProviderType) {
    UserProviderType[UserProviderType["EMAIL"] = 0] = "EMAIL";
    UserProviderType[UserProviderType["GOOGLE"] = 1] = "GOOGLE";
})(UserProviderType || (UserProviderType = {}));
exports.UserProviderType = UserProviderType;
