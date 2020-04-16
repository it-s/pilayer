const path = require("path");
const Config = require('./Config');
module.exports = class {
    type = "";
    path = "";
    name = "";
    extension = "";
    player = null;
    constructor(file) {
        const player = Config.getInstance().players.find(player => new RegExp(player.match).exec(file));
        if (player) {
            this.path = file;
            this.type = player.type;
            this.extension = path.extname(file);
            this.name = path.basename(file, this.extension);
            this.player = { ...player };
            this.player.options = player.options.map(option => option.replace("::filename::", this.path));
        }
    }
}