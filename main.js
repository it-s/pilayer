const arguments = require('commander');
const Config = require("./Config");
const Utils = require("./Utils");
const pkg = require("./package.json");

try {
    arguments
        .version(pkg.version)
        .description('Play various music formats in command line')
        .option("-c, --config <filepath>", "pilay config file path (default is player.config.json)", "player.config.json")
        .option("-g, --gui <gui>", "GUI to display. Options are: cmd, blessed", "cmd")
        .parse(process.argv);
    Utils.Assert(arguments.config, { error: "Config param is required. Check --help" });

    // Initialize config
    new Config(Utils.toAbsolutePath(arguments.config));

    // Initialize gui
    switch(arguments.gui) {
        case "blessed":
            const BlessedGUI = require("./GUI.blessed");
            new BlessedGUI();
            break;
        case "cmd":
        default:
            const CMDGUI = require("./GUI.cmd")
            new CMDGUI();
    }

} catch (err) {
    console.error(err);
    process.exit(1);
}