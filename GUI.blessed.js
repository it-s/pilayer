const Blessed = require('blessed');
const GUI = require("./GUI");

const auto = 'shrink';

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

const Style = {
  bg: "black",
  fg: "silver",
  bold: false,
  active: {
    bg: "black",
    fg: "white",
    bold: true
  },
  accent: {
    bg: "yellow",
    fg: "black"
  },
  border: {
    bg: "black",
    fg: "silver"
  },
  hover: {
    bg: "yellow",
    fg: "black"
  }
};
Style.button = {
  bg: "black",
  fg: "silver",
  bold: false,
  border: Style.border,
  hover: Style.hover
};

const Screen = Blessed.screen({
  fastCSR: true,
  autoPadding: false,
  title: "Pi-lay"
});

const Layout = Blessed.layout({
  parent: Screen,
  top: 0, left: 0,
  width: "100%", height: "100%"
});

const Toolbar = Blessed.listbar({
  parent: Layout,
  top: 0, left: 0,
  width: '100%',
  height: auto,
  mouse: true,
  keys: true,
  border: 'line',
  style: {
    fg: Style.fg,
    bg: Style.bg,
    border: {
      fg: Style.bg,
      bg: Style.bg,
    }
  }
});

const Playlist = Blessed.list({
  parent: Layout,
  label: ' ... ',
  tags: true,
  top: 0, left: 0,
  width: '100%',
  height: 7,
  keys: false,
  mouse: false,
  border: 'line',
  scrollbar: false,
  draggable: false,
  style: {
    fg: Style.fg,
    bg: Style.bg,
    border: Style.border,
    label: {
      fg: Style.fg,
      bg: Style.bg,
      bold: true
    },
    selected: Style.accent
  }
})

const Info = Blessed.box({
  parent: Layout,
  left: 0, top: 0,
  width: "100%", height: 3,
  align: "left", valign: "middle",
  style: {
    fg: Style.fg,
    bg: Style.bg
  }
});

const Controls = Blessed.layout({
  parent: Layout,
  left: 0, top: 0,
  height: 7,
  width: '100%',
  style: {
    fg: Style.fg,
    bg: Style.bg
  }
});

/*const Volume = Blessed.progressbar({
  border: 'line',
  parent: Layout,
  left: 0, top: 0,
  width: '100%',
  // height: 1,
  orientation: 'horizontal',
  align: "center", valign: "middle",
  mouse: true,
  style: {
    fg: Style.fg,
    bg: Style.bg,
    bar: Style.accent,
    border: {
      fg: Style.bg,
      bg: Style.bg,
    },
  },
  content: 'Volume: 50%',
  filled: 50
});
*/
const Previous = Blessed.box({
  parent: Controls,
  left: 0, top: 0,
  width: "20%", height: "100%",
  content: '<<',
  align: "center", valign: "middle",
  border: {
    type: 'line'
  },
  style: {...Style.button}
});

const Play = Blessed.box({
  parent: Controls,
  left: "25%", top: 0,
  width: "25%", height: "100%",
  content: 'Play',
  align: "center", valign: "middle",
  border: {
    type: 'line'
  },
  style: {...Style.button}
});

const Stop = Blessed.box({
  parent: Controls,
  left: "55%", top: 0,
  width: "20%", height: "100%",
  content: 'Stop',
  align: "center", valign: "middle",
  border: {
    type: 'line'
  },
  style: {...Style.button}
});

const Next = Blessed.box({
  parent: Controls,
  left: "80%", top: 0,
  width: "20%", height: "100%",
  content: '>>',
  align: "center", valign: "middle",
  border: {
    type: 'line'
  },
  style: {...Style.button}
});


module.exports = class extends GUI {
  constructor() {
    super();
    // Quit on Escape, q, or Control-C.
    Toolbar.setItems({
      'Mute': {
        keys: ['0'],
        callback: () => false
      },
      'Volume -': {
        keys: ['1'],
        callback: () => false
      },
      'Volume +': {
        keys: ['2'],
        callback: () => false
      },
      'Shuffle': {
        keys: ['tab'],
        callback: () => this.player.shuffle()
      },
      'Quit': {
        keys: ['q', 'escape', 'C-c'],
        callback: () => this.exit()
      },
      'Shutdown': {
        keys: ['f12'],
        callback: () => false
      }
    });
    Toolbar.select(-1);
    Previous.on('click', () => this.player.previous());
    Next.on('click', () => this.player.next());
    Stop.on('click', () => this.player.stop());
    Play.on('click', () => this.player.play());
    // Render the screen.
    Screen.render();
  }
  render(action, data) {
    switch (action) {
      case "init":
        Playlist.setLabel(` Playlist (${data.length} tunes) `);
      case "shuffle":
        Playlist.setItems(data.list.map((tune, i) => `${(i + 1 + "").padStart(3, " ")}. ${capitalize(tune.name)} (${tune.extension}) - ${tune.player.name}`));
        Playlist.select(data.position);
        break;
      case "stop":
        Play.style = {
          ...Style.button
        };
        Stop.style = {
          ...Style.button,
          ...Style.active
        };
        break;
      case "endlist":
        break;
      case "startlist":
        break;
      case "next":
      case "previous":
        Playlist.select(data.playlist.position + 1);
        Playlist.select(data.playlist.position);
      case "play":
        Stop.style = {
          ...Style.button
        };
        Play.style = {
          ...Style.button,
          ...Style.active
        };
      default:
        const min = Math.floor(data.time / 60);
        const sec = ((data.time - min * 60) + "").padStart(2, "0");
        const text = `   ${data.isPlaying ? "Playing" : "Stopped"}: [${min}:${sec}] ${capitalize(data.tune.name)} (${data.tune.extension}) - ${data.tune.player.name}`;
        Info.setContent(text);
        Screen.render();
    }
  }
  exit() {
    console.log("\n");
    super.exit();
  }
}

