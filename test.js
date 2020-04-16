const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main() {
  const { stdout, stderr } = await exec('adplay -o /home/eugene/Sync/Music/Chiptunes/adlib/amd/madness-chipmunks.amd');

  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  console.log(`Number of files ${stdout}`);
}

main()