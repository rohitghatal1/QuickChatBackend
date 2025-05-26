"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    var _a;
    if (err) {
        if (err.message) {
            if (err.message.includes("dation failed:")) {
                err.message = (_a = err.message.split(":")[2]) === null || _a === void 0 ? void 0 : _a.trim();
            }
            res.status(400).json({
                status: "failed",
                message: err.message,
            });
        }
        else {
            res.status(400).json({
                status: "failed",
                message: err,
            });
        }
        console.log(err);
    }
    else {
        next();
    }
};
exports.default = errorHandler;
