const path = require('node:path');
const resolve = path.resolve;
const globals = require('../.globals.js');
const config = require(path.normalize(globals.workDir + '/' + '.config.js'));

let tick = (new Date).getTime();

function tail(filename, lines) {
    return process.env.SHELL ? `tail -n ${lines} '${filename}'` : `${resolve('./.misc/tail.cmd')} ${lines} ${resolve(filename)}`
}

module.exports = [
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

    // config
    () => (JSON.stringify({
        globals,
        config,
    }, undefined, 2)),

    // functions not returning 
    () => ({command: tail(__filename, 1), run: true}), 

]


// Cheers!