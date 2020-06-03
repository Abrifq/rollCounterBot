const environmentVariables = require("process").env;
exports.token = environmentVariables.token;
exports.donators = JSON.parse(environmentVariables.donators);