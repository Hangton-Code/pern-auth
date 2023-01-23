"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../helpers/errorHandler");
function validationHandler(req, res, next) {
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty())
        throw new errorHandler_1.APIError("Validation Failed", {
            statusCode: 400,
            body: {
                validationResult: err.array(),
            },
        });
    req.body = (0, express_validator_1.matchedData)(req, { includeOptionals: true, locations: ["body"] });
    req.query = (0, express_validator_1.matchedData)(req, {
        includeOptionals: true,
        locations: ["query"],
    });
    next();
}
exports.default = validationHandler;
