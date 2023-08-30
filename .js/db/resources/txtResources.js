const fs = require('node:fs');
const path = require('node:path');
const { settings } = require('../../../.globals');
const { dirList } = require('../../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('../../lib/common');
const {Model} = require('../models')

module.exports = function txtResources(name = 'Data/Armor.txt') {    
    debug(arguments)
    let txt;
    if (fs.existsSync(name)) {
        txt = fs.readFileSync(name, 'utf8')
    } else {
        txt = dirList().map(dir => path.normalize(dir + '/Stats/Generated/' + name ?? ''))//.map(f => {debug(f, fs.existsSync(f)); return f})
                .filter(f => fs.existsSync(f))//.map(f => {debug(f); return f})
                            .map(p => fs.readFileSync(p, 'utf8'))
                            .join("\r\n\r\n");
    }
    txt = txt.split("\r\n\r\n").filter(i => i);
    print(txt.length, 'entries')
    let res = txt
    .map(e => {
        return Model.getByText(e);
    }).filter(i => i);
    // log(res)
    
    return res;
}