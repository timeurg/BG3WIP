const path = require('node:path');
const resolve = path.resolve;
const globals = require('../.globals.js');
let config = require(path.normalize(globals.workDir + '/' + '.config.js'));

// An ordinary JS variable in an ordinary js file
let tick = (new Date).getTime();
config = {
    globals,
    config
}

// List of commands
module.exports = [
    // Just to be sure it starts at all, not neccessary in real scripts
    `node bg3`,

    // string commands are passed to bash/cmd/powershell
    `echo ${tick}`,  

    // change variable
    () => tick = 10, 
    
    // this won't show any changes as it was calculated on bootstrap
    `echo ${tick}`,  

    // this will
    () => `echo ${tick}`, 

    // and this will call resulting command, notice {run:true, command} interface
    () => ({command: `echo ${tick}`, run: true}),

    // print entire config with no cuts
    () => ({result: JSON.stringify(config, undefined, 2), show: -1}),

    // print last n lines of a file, can be useful
    () => ({command: tail(__filename, 1), run: true}),

    // run the game
    `node bg3 mod:game`,

]

function tail(filename, lines) {
    return process.env.SHELL ? `tail -n ${lines} '${filename}'` : `${resolve('./.misc/tail.cmd')} ${lines} ${resolve(filename)}`
}

// Cheers!