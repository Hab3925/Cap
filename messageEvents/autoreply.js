// Server
const volcanoidsServerId = "444244464903651348";

// Channel
const discussOtherGamesChannelId = "496325967883534337";
const faqChannelId = "454972890299891723";

// Emoji
const thumbsUpId_cogHand = "713469848193073303"; // :cogLike:
const thumbsUpId_testing = "545279802198851615"; // :kappa:

const thumbsDownId_cogHand = "722120016723574805"; // :cogThumbsDown:
const thumbsDownId_testing = "546734308161749011"; // :Shotgun:

// Don't put these in a repeated function. They do not need to be recreated every time we run it.
// This needs to be called in a static context when the file inits so we don't have to recreate the regex every time we parse a message.

const consolePart1 = `(will|game|to|available)`;
const consolePart2 = `(console|xbox|ps4|ps5|playstation)`; // The target.
const consoleAutoreplyRegex = CreateAutoReplyRegex([
    `${consolePart2}.*${consolePart1}`,
    `${consolePart1}.*${consolePart2}`
], `igm`);

// A var since I keep copying the "the game", "it", "this", etc in many of these.

const theGamePart1 = `(that|the|this)`; // The 'the' part of 'the game'. The group of words that patch the first part.
const theGamePart2 = `(game|it|volcanoid(s?))`; // The 'game' part of 'the game'. The group of words that patch the last part.

// Merge so we either match: The first part, the second part, or both parts.
// e.g. we match: 'the', 'the game', or 'game'.
// Breakdown:               'the'     |     'game'    |            'the game'
const theGameRegex = `(${theGamePart1}|${theGamePart2}|${theGamePart1}\\s${theGamePart2})`;

const steamAutoreplyRegex = CreateAutoReplyRegex([
    `when(('|’)s|s| is)?(\\s${theGameRegex})? (come|coming) out`,
    `is(\\s${theGameRegex}) (out|released|available)( yet)?`,
    `(where|how) (can|do).*?(get|buy|play)\\s.*?${theGameRegex}`,
    `(where|how).*?download`,
    `(is|if|will)( [^ \\n]+?)?\\s${theGameRegex}( (?!only)[^ \\n]+?)? (free|on steam)`,
    `what.*?(get|buy|is)\\s.*?${theGameRegex}?( [^ \\n]+?)? on(\\s|\\?|\\.)`,
    `how much\\s.*?${theGameRegex}? cost`,
    `how (much|many)( [^ \\n]+?)? is\\s${theGameRegex}`,
    `can i play( [^ \\n]+?)?(\\s${theGameRegex})? now`,
    `price in (usd|dollars|aud|cad)`
], `igm`);

module.exports.run = async (client, message, isTesting) => {
    const thumbsUpId = isTesting ? thumbsUpId_testing : thumbsUpId_cogHand;
    const thumbsDownId = isTesting ? thumbsDownId_testing : thumbsDownId_cogHand;

    const thumbsUp = client.emojis.cache.get(thumbsUpId);
    const thumbsDown = client.emojis.cache.get(thumbsDownId);

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
 * LEAVE AS A FUNCTION. NOT A VARIABLE. This needs to be called in a static context when the file inits so we don't have to recreate the regex every time we parse a message.
 * Also needs to be a func so we can run it without running the Discord bot at all.
 *
 * @param individualLinesToMatch Patterns to merge.
 * @param flags                  (Optional) Regex flags to use.
 * @param ignoreQuotedText       (Optional) Makes sure each individual pattern ignores lines that start with `>`.
 * @param ignoreCodeText         (Optional) Makes sure each individual pattern ignores matches surrounded with `. (Currently broken.)
 */
function CreateAutoReplyRegex(individualLinesToMatch, flags = "", ignoreQuotedText = true, ignoreCodeText = true) {
    let regexStr = ``;

    individualLinesToMatch.forEach((line, index) => {
        let toMatch = line
        if (index > 0) regexStr += `|`;

        // Broken. Doesn't work for lines that start directly with the part we're matching.
        //if (ignoreCodeText === true) toMatch = `[^\`]${toMatch}[^\`]`

        if (ignoreQuotedText === true) toMatch = `^(?!>).*?${toMatch}`;

        //console.log(`Adding: ${toMatch}`);

        regexStr += `(${toMatch})`
    });

    //console.log(`\nMade Regex: ${regexStr}\n`);

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