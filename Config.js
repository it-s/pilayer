const Assert = require("./Utils.js").Assert;
const fileExists = require("./Utils.js").fileExists;
const toAbsolutePath = require("./Utils.js").toAbsolutePath;

var _Singleton = {};

module.exports = class {
    v = 1;
    sourcepath = "";
    database = "";
    players = [];
    types = [];
    constructor(file) {
        Assert(file, { error: "Config file path is required" });
        Assert(fileExists(file), { error: `Could not find ${file}. Does it exist?` });
        const config = require(file);
        Assert(config.sourcepath, "sourcepath is required. Check config file");
        Assert(config.database, "database is required. Check config file");
        Assert(config.players, "players list is required. Check config file");
        Object.assign(this, config);
        this.sourcepath = toAbsolutePath(this.sourcepath);
        this.database = toAbsolutePath(this.database);
        this.types = this.players.map(player => player.type);
        _Singleton = this;
    }
    static getInstance() {
        return Assert(_Singleton, { error: "There is no config isntance. Please run main.js first" });
    }
}