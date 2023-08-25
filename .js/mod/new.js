const { modProps, settings } = require('../../.globals');
const { log, print, count, error, logged, timed, unlogged, untimed, usage, debug } = require('../lib/common');
const path = require('node:path');
const fs = require('node:fs');
const { dirList } = require('../lib/file');
const sax = require("../lib/sax");
const readdir = require("node:fs");

module.exports = function newMod(name) {
    if(!name) {
        error('Please provide a name for your new mod')
        return
    }
    try {
        const files = fs.readdirSync('./.mod_bp', { recursive: true, withFileTypes: true });
        files.map(f => {
            if (f.isFile()) {
                const filename = path.normalize(
                    f.path
                        .replaceAll('BG3WIP', name)
                        .replace('.mod_bp', settings.locations.workDir ) + '/' + f.name
                );
                log(filename)
                let contents = fs.readFileSync(f.path + '/' + f.name, 'utf8')
                debug(contents)
                fs.mkdirSync(filename, {recursive: true})
                fs.writeFileSync(filename, contents)
            }
        })
    } catch (err) {
        error(err); 
    } 
}