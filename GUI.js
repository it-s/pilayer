const Config = require('./Config');
const Player = require('./Player');

module.exports = class {
    config = null;
    player = null;
    constructor() {
        this.render = this.render.bind(this);
        this.config = Config.getInstance();
        this.player = new Player();
        this.player.on('message', this.render);
        this.player.init();
    }
    render() { /* STUB */ }
    exit() {
        this.player.off('message', this.render);
        this.player.destroy();
        process.exit(0);
    }
}