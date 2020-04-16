const arguments = require('commander');
const Config = require("./Config");
const Utils = require("./Utils");
const pkg = require("./package.json");

const GUI = require("./GUI.ncurses");

try {
    arguments
        .version(pkg.version)
        .description('Play various music formats in command line')
        .option("-c, --config <filepath>", "pilayer config file path (default is player.config.json)", "player.config.json")
        .parse(process.argv);
    Utils.Assert(arguments.config, { error: "Config param is required. Check --help" });

    // Initialize config
    new Config(Utils.toAbsolutePath(arguments.config));

    // Initialize gui
    new GUI();

} catch (err) {
    console.error(err);
    process.exit(1);
}