const debugArguments = require("process").argv.slice(2);
const config = require("./config_handler")(debugArguments);
const onMessageHandler = require("./message_handler"),
    discordClient = new (require("discord.js").Client)();


discordClient.on("message", onMessageHandler);
discordClient.once("ready", () => {
    console.log("Discord bot SHOULD be online.");
    discordClient.generateInvite(10240)
        .then(link => "Invite link is " + link)
        .then(console.log);
});
discordClient.login(config.token);

