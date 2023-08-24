const fs = require('node:fs');
const path = require('node:path');
const { settings, modProps } = require('../.globals');
const { dirList } = require('./file');
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('./common');

module.exports = {
    txtResources: unlogged(untimed(txtResources)),
    find: logged(untimed(find)),
    values: unlogged(untimed(values)),    
}

usage.db = `
node bg3 db:find:Data/Armor.txt Hat
node bg3 db:find:TreasureTable.txt Candle
node bg3 db:values:Data/Armor.txt Boosts
node bg3 db:values:Data/Armor.txt Boosts --dump Boosts.txt
`

function find(resource, string) {
    debug('find', arguments)
    let res = timed(txtResources(resource)).filter(e => Object.keys(e).map(i => e[i].indexOf(string) !== -1).reduce((a, b) => a || b));
    print(res.length, 'items found');
    return res;
}

function values(resource, prop) {
    let propMap = {};
    txtResources(resource).map(item => item[prop] ? propMap[item[prop]] = 1 : '');
    let res = Object.keys(propMap);
    return res;
}

function txtResources(name = 'Data/Armor.txt') {    
    debug(arguments)
    let txt = dirList().map(dir => path.normalize(dir + '/Stats/Generated/' + name ?? '')).map(f => {debug(f, fs.existsSync(f)); return f})
                       .filter(f => fs.existsSync(f)).map(f => {debug(f); return f})
                       .map(p => fs.readFileSync(p, 'utf8'))
                       .join();
    txt = txt.split("\r\n\r\n");
    log(txt.length, 'entries')
    let res = txt
    .map(e => {
        let entry = {
            // __raw__: e
        };
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
            entry[prop] = data.length > 1 ? data : data[0];
        })
        return entry;
    }).filter(i => i);
    // log(res)
    
    return res;
}