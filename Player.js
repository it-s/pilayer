const { spawn } = require('child_process');
const { EventEmitter } = require('events');
const Playlist = require("./Playlist");
const Config = require('./Config');

module.exports = class {
    tune = null;
    config = null;
    repeat = false;
    shuffle = false;
    playlist = null;
    isPlaying = false;
    _time = 0;
    _proc = null;
    _onChange = null;
    _onError = null;
    _tickHandler;
    constructor(onChange = () => { }) {
        this.config = Config.getInstance();
        this.repeat = this.config.repeat;
        this.shuffle = this.config.shuffle;
        this._tick = this._tick.bind(this);
        this._onChange = onChange;
        this.reset();
        this._tickHandler = setInterval(this._tick, 1000);
    }
    _tick() {
        if (this.isPlaying) this._time += 1;
        this._onChange("tick", {
            isPlaying: this.isPlaying,
            tune: this.tune,
            time: this._time
        });
    }
    reset() {
        this.playlist = new Playlist(this.config.sourcepath, {
            repeat: this.repeat,
            shuffle: this.shuffle,
        });
        this.tune = this.playlist.current;
        this._onChange("reset", this.playlist);
    }
    _procexit(sig) {
        if (sig != 0) return;
        if (this.config.autoplay) this.next();
        else this.stop();
    }
    _play() {
        if (!this.isPlaying) {
            this.tune = this.playlist.current;
            this._proc = spawn(this.tune.player.cmd, this.tune.player.options);
            this._proc.on('close', this._procexit.bind(this));
            this.isPlaying = true;
            this._time = 0;
            return true;
        }
        return false;
    }
    play() {
        if (this._play()) {
            this._onChange("play", this.tune, this.playlist.position);
        }
    }
    _stop() {
        if (this.isPlaying) {
            this._proc.pid &&
                this._proc.kill();
            this.isPlaying = false;
            return true;
        }
        return false;
    }
    stop() {
        if (this._stop()) {
            this._onChange("stop", this.tune, this.playlist.position);
        }
    }
    next() {
        const tune = this.playlist.next();
        if (tune) {
            this._stop();
            this.tune = tune;
            this._play();
            this._onChange("next", this.tune);
        } else {
            this.stop();
            this._onChange("endlist", this.playlist);
        }
    }
    previous() {
        const tune = this.playlist.previous();
        if (tune) {
            this._stop();
            this.tune = tune;
            this._play();
            this._onChange("previous", this.tune);
        } else {
            this.stop();
            this._onChange("startlist", this.playlist);
        }
    }
    destroy() {
        this.stop();
        clearInterval(this._tickHandler);
    }
}