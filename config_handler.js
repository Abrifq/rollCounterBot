let cachedConfig;

/**
 * @returns {{token:string,donators:Array<string>}}
 * @param {Array<string>} args 
 */

function config_getter  (args) {
    if(cachedConfig){return cachedConfig;}
    if (args.some(string => string === "local-mode")) {
         cachedConfig = require("./local_config_handler");
    } else {
         cachedConfig = require("./heroku_config_handler");
    }
    return cachedConfig;
}
exports= module.exports = config_getter;