const Config = require('./Config');
const Player = require('./Player');

module.exports = class {
    config = null;
    player = null;
    constructor() {
        this.config = Config.getInstance();
        this.player = new Player(this.render.bind(this));
    }
    render() { /* STUB */ }
    onExtit() {
        this.onStop();
        this.isRunning = false;
    }
}