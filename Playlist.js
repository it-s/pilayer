const Utils = require("./Utils");
const Tune = require("./Tune");

const defaults = { repeat: false, shuffle: false };
let list = [];

module.exports = class {
    position = 0;
    list = [];
    repeat = false;
    shuffle = false;
    constructor(sourcepath, opts = {}) {
        Object.assign(this, defaults, opts);
        if (list.length === 0)
            this._rescan(sourcepath);
        this._reset();
        if (this.shuffle) this._shuffle();
    }
    _rescan(sourcepath) {
        const files = Utils.scanDirectorySync(sourcepath);
        list = files.map(file => new Tune(file)).filter(tune => Boolean(tune.player));
    }
    _shuffle() {
        let j, x, i;
        this._reset();
        for (i = this.list.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.list[i];
            this.list[i] = this.list[j];
            this.list[j] = x;
        }
    }
    _reset() {
        this.list = [...list];
        this.position = 0;
    }
    get length() {
        return this.list.length;
    }
    get current() {
        return this.list[this.position];
    }
    previous() {
        let position = this.position - 1;
        if (position >= 0) {
            this.position = position;
            return this.current;
        } else if (this.repeat) {
            this.position = this.list.length - 1;
            return this.current;
        } else {
            return false;
        }
    }
    next() {
        let position = this.position + 1;
        if (position < this.list.length) {
            this.position = position;
            return this.current;
        } else if (this.repeat) {
            this.position = 0;
            return this.current;
        } else {
            return false;
        }
    }
    // list(size = 6) {
    //     const from = Math.max(0, this.position - (Math.floor(size / 2)));
    //     const to = Math.min(this.list.length - 1, this.position + (Math.floor(size / 2)));
    //     return this.list.slice(from, to).map((tune, i) => ({
    //         type: tune.type,
    //         name: tune.name,
    //         extension: tune.extension,
    //         index: (from + i) + 1
    //     }));
    // }
};