const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const Playlist = require("./Playlist");
const Config = require('./Config');

module.exports = class extends EventEmitter {
    tune = null;
    config = null;
    repeat = false;
    shuffle = false;
    playlist = null;
    isPlaying = false;
    _time = 0;
    _proc = null;
    _tickHandler;
    constructor() {
        super();
        this.config = Config.getInstance();
        this.repeat = this.config.repeat;
        this.shuffle = this.config.shuffle;
        this._tick = this._tick.bind(this);
        this._procexit = this._procexit.bind(this);
        this._tickHandler = setInterval(this._tick, this.config.tick);
    }
    _tick() {
        if (this.isPlaying) this._time += 1;
        this.emit("message", "tick", {
            isPlaying: this.isPlaying,
            tune: this.tune,
            time: this._time
        });
    }
    init() {
        this.playlist = new Playlist(this.config.sourcepath, {
            repeat: this.repeat,
            shuffle: this.shuffle,
        });
        this.tune = this.playlist.current;
        this.emit("message", "init", this.playlist);
        if(this.config.autoplay) this.play();
    }
    _procexit(sig) {
        if (this._proc.killed || isNaN(sig)) return;
        if (this.config.autoplay) this.next();
        else this.stop();
    }
    _play() {
        if (!this.isPlaying) {
            this.tune = this.playlist.current;
            this._proc = spawn(this.tune.player.cmd, this.tune.player.options);
            this._proc.on('close', this._procexit);
            this.isPlaying = true;
            this._time = 0;
            return true;
        }
        return false;
    }
    play() {
        if (!this.isPlaying && this._play()) {
            this.emit("message", "play", this.tune, this.playlist.position);
        }
    }
    _stop() {
        if (this.isPlaying) {
            if (this._proc && this._proc.pid) {
                this._proc.removeAllListeners('close');
                this._proc.kill();
            }
            this.isPlaying = false;
            this._time = 0;
            return true;
        }
        return false;
    }
    stop() {
        if (this.isPlaying && this._stop()) {
            this.emit("message", "stop", this.tune, this.playlist.position);
        }
    }
    next() {
        const tune = this.playlist.next();
        if (tune) {
            this._stop();
            this.tune = tune;
            this._play();
            this.emit("message", "next", this.tune);
        } else {
            this.stop();
            this.emit("message", "endlist", this.playlist);
        }
    }
    previous() {
        const tune = this.playlist.previous();
        if (tune) {
            this._stop();
            this.tune = tune;
            this._play();
            this.emit("message", "previous", this.tune);
        } else {
            this.stop();
            this.emit("message", "startlist", this.playlist);
        }
    }
    destroy() {
        this.stop();
        clearInterval(this._tickHandler);
    }
}