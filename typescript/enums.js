"use strict";
exports.__esModule = true;
exports.ActionTypes = exports.KeywordTypes = void 0;
var KeywordTypes;
(function (KeywordTypes) {
    KeywordTypes[KeywordTypes["PROFANITY"] = 0] = "PROFANITY";
    KeywordTypes[KeywordTypes["SEXUAL_CONTENT"] = 1] = "SEXUAL_CONTENT";
    KeywordTypes[KeywordTypes["SLURS"] = 2] = "SLURS";
})(KeywordTypes = exports.KeywordTypes || (exports.KeywordTypes = {}));
var ActionTypes;
(function (ActionTypes) {
    ActionTypes[ActionTypes["BLOCK_MESSAGE"] = 0] = "BLOCK_MESSAGE";
    ActionTypes[ActionTypes["SEND_ALERT_MESSAGE"] = 1] = "SEND_ALERT_MESSAGE";
    ActionTypes[ActionTypes["TIMEOUT"] = 2] = "TIMEOUT";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
