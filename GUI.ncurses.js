const GUI = require("./GUI");
const rdl = require("readline");
const stdin = process.stdin;

module.exports = class extends GUI {
    constructor() {
        super();
        this.player.play();
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', (key) => {
            switch (key) {
                case "n": this.player.next(); break;
                case "b": this.player.previous(); break;
                case "s": this.player.stop(); break;
                case "p": this.player.play(); break;
                case "q": this.exit();
            }
        });
    }
    render(action, data) {
        switch (action) {
            case "reset":
                console.log("Total tunes found:", data.length);
                break;
            case "play":
                console.log("\nPlaying", data.name, "using", data.player.name);
                break;
            case "next":
            case "previous":
                console.log("\nNext", data.name, "using", data.player.name);
                break;
            case "stop": console.log("\nPlayer stopped");
                break;
            case "endlist": console.log("\nReached end of playlist");
                break;
            case "startlist": console.log("\nAt the beginning of playlist");
                break;
            default:
                rdl.cursorTo(process.stdout, 0);
                const min = Math.floor(data.time / 60);
                const sec = ((data.time - min * 60) + "").padStart(2, "0");
                process.stdout.write(`elapsed time: ${min}:${sec}`);
        }
    }
    exit() {
        this.player.destroy();
        process.exit(0);
    }
}