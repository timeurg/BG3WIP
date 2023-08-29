const fs = require('node:fs');
const path = require('node:path');
const { settings } = require('../../../.globals');
const { dirList } = require('../../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('../../lib/common');

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
    txt = txt.split("\r\n\r\n");
    print(txt.length, 'entries')
    let res = txt
    .map(e => {
        const propMap = {
            'new entry': 'name',
            type: 'type',
            using: 'using'
        }, rPropMap = {};
        Object.keys(propMap).map(k => rPropMap[propMap[k]] = k)
        const armor = {
            toString: function toArmorString() {
                return (Object.keys(this).map(k => `${rPropMap[k] || `data ${k}`} "${Array.isArray(this[k]) ? this[k].join('"') : this[k]}"`).join("\r\n") + "\r\n")
            }
        }
        let entry = Object.create(armor);
        e.split("\r\n").map(line => {
            // print(line)
            let prop = line.substring(0, line.indexOf(' "'));
            // log(prop)
            let data = line.replace(prop, '');
            data = data.trim().substring(1, data.length - 2);     
            data = data.split('" "');
            if (prop == 'data') {
                prop = data[0];
                data = data.slice(1);
            }
            entry[propMap[prop] ?? prop] = data.length > 1 ? data : data[0];
        })
        return entry;
    }).filter(i => i);
    // log(res)
    
    return res;
}