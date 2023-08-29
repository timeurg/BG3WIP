const {promisify} = require('util');
const {exec} = require('child_process');
const execAsync = promisify(exec);

const commands = require(process.argv[2])
  
commands.reduce((p, c) => p.then(() => execAsync(c)), Promise.resolve()).then(() => console.log('done'));