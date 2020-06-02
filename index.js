const debugArguments = require(process).argv.slice(2),
    onMessageHandler = require("./message_handler"),
    discordClient = new (require("discord.js").Client)();
const config = (function (args) {
    if (args.some(string => string === "local-mode")) {
        return require("./local_config_handler");
    } else {
        return require("./heroku_config_handler");
    }
})(debugArguments);

discordClient.on("message", onMessageHandler);
discordClient.once("ready", () => {
    console.log("Discord bot SHOULD be online.");
    discordClient.generateInvite(141312)
    .then(link => "Invite link is " + link)
    .then(console.log);
});
discordClient.login(config.token);

