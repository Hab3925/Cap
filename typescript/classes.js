"use strict";
exports.__esModule = true;
exports.Action = exports.ActionMetadata = exports.CapErrors = void 0;
var enums_1 = require("./enums");
var CapErrors = /** @class */ (function () {
    function CapErrors() {
    }
    CapErrors.KeywordTypesError = 'Types Array Contains Non-KeywordTypes Enum Value.';
    return CapErrors;
}());
exports.CapErrors = CapErrors;
var ActionMetadata = /** @class */ (function () {
    function ActionMetadata(channel_id, duration) {
        this.channel_id = channel_id;
        this.duration = duration;
    }
    return ActionMetadata;
}());
exports.ActionMetadata = ActionMetadata;
var Action = /** @class */ (function () {
    function Action(type, metadata) {
        this.type = type;
        this.typeId = enums_1.ActionTypes[enums_1.ActionTypes[type]] + 1;
        this.data = metadata;
    }
    return Action;
}());
exports.Action = Action;
