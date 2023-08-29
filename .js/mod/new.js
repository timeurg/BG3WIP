const { settings } = require('../../.globals');
const { log, print, count, error, logged, timed, unlogged, untimed, usage, debug } = require('../lib/common');
const path = require('node:path');
const fs = require('node:fs');
const { dirList } = require('../lib/file');
const sax = require("../lib/sax");
const readdir = require("node:fs");
const { randomUUID } = require('node:crypto');
const readline = require('readline-sync')

module.exports = (config) => function newMod(name) {
    debug(arguments)
    if(!name) {
        error('Please provide a name for your new mod')
        return
    }
    const get = (configParam, canBeEmpty = true) => {
        let res = config[configParam];
        if (!res && !canBeEmpty) {
            throw new Error(`${configParam} can't be empty, please set it using "mod:config ${configParam} _VALUE_" command`)
        }
        return res || ''
    }
    const replaceMap = {
        BG3WIP: name
    }
    try {
        replaceMap['__AUTHOR__'] = '' + get('author', false)
        replaceMap['__DESCRIPTION__'] = '' + get('description')
        replaceMap['__UUID__'] = randomUUID()
    } catch (e) {
        error(e)
        return
    }
    
    function update(contents) {
        Object.keys(replaceMap).map(k => (contents = contents.replaceAll(k, replaceMap[k])) && log('Replacing', k, replaceMap[k]))
        return contents
    }
    try {
        let warned = false, agreed = false, fresh = true;
        const files = fs.readdirSync('./.mod_bp', { recursive: true, withFileTypes: true });
        // debug('Start copying', files)        
        files.map(f => {
            if (f.isFile()) {
                const filename = path.normalize(
                    f.path
                        .replaceAll('BG3WIP', name)
                        .replace('.mod_bp', settings.locations.workDir ) + '/' + f.name
                );
                if (fs.existsSync(filename) && !warned) {
                    fresh = false
                    warned = true
                    agreed = readline.keyInYN('Target directory is not empty. Files will be overwtitten. Proceed? (y,n)')
                }
                if (fresh || agreed) {
                    print('Copying file', filename)
                    let contents = update(fs.readFileSync(f.path + '/' + f.name, 'utf8'))
                    debug(contents)
                    fs.mkdirSync(path.dirname(filename), {recursive: true})
                    fs.writeFileSync(filename, contents)
                }
            }
        })
    } catch (err) {
        error(err); 
    } 
}