let cachedConfig;

/**
 * @returns {{token:string,donators:Array<string>,maxDiceSide:number)}}
 * @param {Array<string>} args 
 */

function config_getter(args=[]) {
     if (cachedConfig) { return cachedConfig; }
     if (args.some(string => string === "local-mode")) {
          cachedConfig = require("./local_config_handler");
     } else {
          cachedConfig = require("./heroku_config_handler");
     }
     const extraConfig = require("./extra_config.json");
     Object.assign(cachedConfig, extraConfig);
     return cachedConfig;
}
exports = module.exports = config_getter;