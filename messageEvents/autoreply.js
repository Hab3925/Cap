// Server
const volcanoidsServerId = "444244464903651348";
const captainsSubmarineServerId = "488708757304639520";

// Channel
const discussOtherGamesChannelId = "496325967883534337";
const autoReplyFeedbackChannelId = "754675846132006972";
const faqChannelId = "454972890299891723";

// Message
const autoReplyFeedbackMessageId = "754702829976944673";

module.exports.run = async (client, message, isTesting) => {
    // Emoji
    const thumbsUpId_cogHand = "713469848193073303"; // :cogLike:
    const thumbsUpId_testing = "545279802198851615"; // :kappa:
    const thumbsUpId = isTesting ? thumbsUpId_testing : thumbsUpId_cogHand;

    const thumbsDownId_cogHand = "722120016723574805"; // :cogThumbsDown:
    const thumbsDownId_testing = "546734308161749011"; // :Shotgun:
    const thumbsDownId = isTesting ? thumbsDownId_testing : thumbsDownId_cogHand;

    // Init some global vars so we don't have to do this on each command.
    thumbsUp = client.emojis.cache.get(thumbsUpId);
    thumbsDown = client.emojis.cache.get(thumbsDownId);

    let consoleAutoreplyRegex = CreateAutoReplyRegex([
        `console.*(will|game|to|available)`,
        `(will|game|to|available).*console`,
        `xbox.*(will|game|to|available)`,
        `(will|game|to|available).*xbox`,
        `(ps4|ps5).*(will|game|to|available)`,
        `(will|game|to|available).*(ps4|ps5|playstation)`
    ],
        `igm`);

    // A var since I keep copying the "the game", "it", "this", etc in many of these.
    const theGameRegex = `( (that|the|this))?( (game|it|volcanoid(s?)))?`;
    let steamAutoreplyRegex = CreateAutoReplyRegex([
        `when(('|’)s|s| is)?${theGameRegex} (come|coming) out`,
        `is${theGameRegex} (out|released|available)( yet)?`,
        `(where|how) (can|do).*?(get|buy|play).*?${theGameRegex}`,
        `(where|how).*?download`,
        `(is|if|will)( [^ \\n]+?)?${theGameRegex}( (?!only)[^ \\n]+?)? (free|on steam)`,
        `what.*?(get|buy|is).*?${theGameRegex}( [^ \\n]+?)? on`,
        `how much.*?${theGameRegex} cost`,
        `how (much|many)( [^ \\n]+?)? is${theGameRegex}`,
        `can i play( [^ \\n]+?)?${theGameRegex} now`,
        `price in (usd|dollars|aud|cad)`
    ],
        `igm`);


    // Autoreply (If running as cogbot or on the Volcanoids server. Ignoring discuss-other-games.)
    if ((isTesting || message.guild.id == volcanoidsServerId) && message.channel.id !== discussOtherGamesChannelId) {
        if (consoleAutoreplyRegex.exec(message.content)) {
            CreateAutoReply(message.channel, `**Volcanoids**? On **consoles**? Yes sir! But so far the main priority is adding more content before they dive into all the console shenanigans. That Rich guy will keep you updated!`, true /* Include check FAQ text. */);
        }
        if (steamAutoreplyRegex.exec(message.content)) {
            CreateAutoReply(message.channel, `You can get Volcanoids on Steam here: https://store.steampowered.com/app/951440/Volcanoids/`, true /* Include check FAQ text. */);
        }
    }

}

/**
 * Pass an array of individual regex to match. This will merge them into one pattern.
 *
 * @param individualLinesToMatch Patterns to merge.
 * @param flags                  (Optional) Regex flags to use.
 * @param ignoreQuotedText       (Optional) Makes sure each individual pattern ignores lines that start with `>`.
 * @param ignoreCodeText         (Optional) Makes sure each individual pattern ignores matches surrounded with `. (Currently broken.)
 */
const CreateAutoReplyRegex = (individualLinesToMatch, flags = "", ignoreQuotedText = true, ignoreCodeText = true) => {
    let regexStr = ``;

    individualLinesToMatch.forEach((line, index) => {
        let toMatch = line
        if (index > 0) regexStr += `|`;

        // Broken. Doesn't work for lines that start directly with the part we're matching.
        //if (ignoreCodeText === true) toMatch = `[^\`]${toMatch}[^\`]`

        if (ignoreQuotedText === true) toMatch = `^(?!>).*?${toMatch}`;

        regexStr += `(${toMatch})`
    });

    //console.log(`Made Regex: ${regexStr}`);

    return RegExp(regexStr, flags);
}

/**
 * Creates a reply on the given channel with the response text.
 * Also handles waiting for feedback.
 * @param channel                      The channel to send the message to.
 * @param response                     The text to use as the base for the message.
 * @param includeCheckFaqMsgInResponse (Optional) Whether to append the canned message about checking the FAQ to the end of the response message.
 */
const CreateAutoReply = async (channel, response, includeCheckFaqMsgInResponse = true) => {
    if (includeCheckFaqMsgInResponse === true) {
        response += `\n\nIf you have any other questions, make sure to read the <#${faqChannelId}>, your question might be already answered there.`;
    }

    channel.send(`${response}\n\nThis autoreply is a work in progress feature, did this help you? (react with ${thumbsUp}) Or was it misplaced? (react with ${thumbsDown}) Thanks for the input!`)
        .then(async (m) => {
            await m.react(thumbsUp);
            await m.react(thumbsDown);
            setTimeout(() => {
                m.createReactionCollector(async (r) => {
                    if (r.emoji.id == thumbsUp.id) {

                        m.edit(response);

                        ShowThanksForFeedback(r);
                        return;
                    } else if (r.emoji.id == thumbsDown.id) {

                        m.edit(response);
                        m.delete({
                            timeout: 10000
                        });

                        ShowThanksForFeedback(r);
                        return;
                    }
                }, {
                    time: 60000
                });
                setTimeout(() => {
                    m.edit(response);
                    m.reactions.cache.forEach(re => re.remove());
                }, 60000);
            }, 200);
        });



    // Local func so we don't have to repeat it for each potential emoji reply.
    const ShowThanksForFeedback = async (r) => {
        channel.send("Thanks for the feedback").then(mess => mess.delete({
            timeout: 5000
        }));
        r.message.reactions.cache.forEach(re => re.remove());
    }
}