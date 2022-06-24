import { Snowflake } from "discord.js";

export const Routes = {
    guildAutoModerationRules(guildId: Snowflake) {
        return `/guilds/${guildId}/auto-moderation/rules`;
    },

    guildAutoModerationRule(guildId: Snowflake, ruleId: Snowflake) {
        return `/guilds/${guildId}/auto-moderation/rules/${ruleId}`;
    }
}