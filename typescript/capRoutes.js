"use strict";
exports.__esModule = true;
exports.Routes = void 0;
exports.Routes = {
    guildAutoModerationRules: function (guildId) {
        return "/guilds/".concat(guildId, "/auto-moderation/rules");
    },
    guildAutoModerationRule: function (guildId, ruleId) {
        return "/guilds/".concat(guildId, "/auto-moderation/rules/").concat(ruleId);
    }
};
