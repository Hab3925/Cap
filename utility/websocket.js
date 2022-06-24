module.exports = (client, token) => {
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("../typescript/capRoutes");
  const { KeywordTypes } = require("../typescript/enums");
  const { CapErrors } = require("../typescript/classes");

  const rest = new REST({ version: "10" }).setToken(token);

  /**
   * Finds and Returns all Custom Auto Moderation Filters for a Guild
   * @param {string} guildId    The ID of the Guild to get filters from
   * @param {int} limit         How many filters to check for
   */
  client.fetchCustomAutoModerationFilters = async (guildId, limit) => {
    let array = [];
    let outputArray = [];
    try {
      const data = await rest.get(
        Routes.guildAutoModerationRules(guildId) + "?limit=" + limit
      );
      array = data;
      array.forEach((e) => {
        if (e.trigger_type == 1) {
          e.forEach((i) => {
            outputArray.push(i);
          });
        }
      });
      return outputArray;
    } catch (e) {
      throw e;
    }
  };

  /**
   * Finds and Returns all Default Auto Moderation Filters for a Guild
   * @param {string} guildId    The ID of the Guild to get filters from
   * @param {int} limit         How many filters to check for
   */
  client.fetchDefaultAutoModerationFilters = async (guildId, limit) => {
    let array = [];
    let outputArray = [];
    try {
      const data = await rest.get(
        Routes.guildAutoModerationRules(guildId) + "?limit=" + limit
      );
      array = data;
      array.forEach((e) => {
        if (e.trigger_type == 4) {
          e.trigger_metadata.keyword_lists.forEach((i) => {
            outputArray.push(i);
          });
        }
      });
      return outputArray;
    } catch (e) {
      throw e;
    }
  };

  /**
   * Creates a Default Auto Moderation Filter
   * @param {string} guildId
   * @param {string} name
   * @param {KeywordTypes[]} keywords
   * @param {Action[]} actions
   * @param {boolean} enabled
   * @param {string[]} exempt_roles
   * @param {string[]} exempt_channels
   */
  client.createDefaultAutoModerationFilter = async (
    guildId,
    name,
    keywords,
    actions,
    enabled,
    exempt_roles,
    exempt_channels
  ) => {
    try {
      let stringArray = [];
      let intArray = [];
      let compiledActions = [];
      keywords.forEach((i) => {
        switch (i) {
          case KeywordTypes.PROFANITY:
            stringArray.push("PROFANITY");
            intArray.push(1);
            break;
          case KeywordTypes.SEXUAL_CONTENT:
            stringArray.push("SEXUAL_CONTENT");
            intArray.push(2);
            break;
          case KeywordTypes.SLURS:
            stringArray.push("SLURS");
            intArray.push(3);
            break;
          default:
            throw CapErrors.KeywordTypesError;
        }
      });

      actions.forEach((i) => {
        let compiledMetadata = {};

        if (i.data != null) {
          if (i.data.channel_id != null) {
            compiledMetadata = { channel_id: i.data.channel_id };
          }

          if (i.data.duration != null && compiledMetadata == {}) {
            compiledMetadata = { duration_seconds: i.data.duration };
          }

          if (i.data.channel_id != null && i.data.duration != null) {
            compiledMetadata = {
              channel_id: i.data.channel_id,
              duration_seconds: i.data.duration,
            };
          }
        }

        compiledActions.push({
          type: i.typeId,
          metadata: compiledMetadata,
        });
      });

      let verify = await client.fetchDefaultAutoModerationFilters(guildId);

      if (verify.length > 0) {
        return client.modifyDefaultAutoModerationFilter(guildId, verify[0].id, {
          name: name,
          event_type: 1,
          trigger_metadata: {
            keyword_lists: stringArray,
            presets: intArray,
          },
          actions: compiledActions,
          enabled: enabled,
          exempt_roles: exempt_roles,
          exempt_channels: exempt_channels,
        });
      }

      const data = await rest.post(Routes.guildAutoModerationRules(guildId), {
        body: {
          name: name,
          event_type: 1,
          trigger_type: 4,
          trigger_metadata: {
            keyword_lists: stringArray,
            presets: intArray,
          },
          actions: compiledActions,
          enabled: enabled,
          exempt_roles: exempt_roles,
          exempt_channels: exempt_channels,
        },
      });
      console.log(data);
      return data;
    } catch (e) {
      throw e;
    }
  };

  client.modifyDefaultAutoModerationFilter = async (guildId, ruleId, data) => {
    const data = await rest.patch(
      Routes.guildAutoModerationRule(guildId, ruleId),
      data
    );
    return data;
  };

  /**
   * Creates a Custom Auto Moderation Filter
   * @param {string} guildId
   * @param {string} name
   * @param {string[]} keywords
   * @param {Action[]} actions
   * @param {boolean} enabled
   * @param {string[]} exempt_roles
   * @param {string[]} exempt_channels
   */
  client.createCustomAutoModerationFilter = async (
    guildId,
    name,
    keywords,
    actions,
    enabled,
    exempt_roles,
    exempt_channels
  ) => {
    try {
      let compiledActions = [];

      actions.forEach((i) => {
        let compiledMetadata = {};

        if (i.data != null) {
          if (i.data.channel_id != null) {
            compiledMetadata = { channel_id: i.data.channel_id };
          }

          if (i.data.duration != null && compiledMetadata == {}) {
            compiledMetadata = { duration_seconds: i.data.duration };
          }

          if (i.data.channel_id != null && i.data.duration != null) {
            compiledMetadata = {
              channel_id: i.data.channel_id,
              duration_seconds: i.data.duration,
            };
          }
        }

        compiledActions.push({
          type: i.typeId,
          metadata: compiledMetadata,
        });
      });

      let verify = await client.fetchCustomAutoModerationFilters(guildId);

      if (verify.length == 3) {
        let array = [];
        keywords.forEach(i => {
            array.push(i);
        })
        verify[0].trigger_metadata.keyword_filter.forEach(i => {
            array.push(i);
        })

        return client.modifyCustomAutoModerationFilter(guildId, verify[0].id, {
          event_type: 1,
          trigger_metadata: {
            keyword_filter: array,
          },
          actions: compiledActions,
          enabled: enabled,
          exempt_roles: exempt_roles,
          exempt_channels: exempt_channels,
        });
      }

      const data = await rest.post(Routes.guildAutoModerationRules(guildId), {
        body: {
          name: name,
          event_type: 1,
          trigger_type: 1,
          trigger_metadata: {
            keyword_filter: keywords,
          },
          actions: compiledActions,
          enabled: enabled,
          exempt_roles: exempt_roles,
          exempt_channels: exempt_channels,
        },
      });
      console.log(data);
      return data;
    } catch (e) {
      throw e;
    }
  };

  client.modifyCustomAutoModerationFilter = async (guildId, ruleId, data) => {
    const data = await rest.patch(
      Routes.guildAutoModerationRule(guildId, ruleId),
      data
    );
    return data;
  };

  client.deleteAutoModerationFilter = async (guildId, ruleId) => {
    const data = await rest.delete(Routes.guildAutoModerationRule(guildId, ruleId));
    return data;
  }
};
