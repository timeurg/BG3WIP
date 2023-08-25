const fs = require('node:fs');
const path = require('node:path');
const { settings, modProps } = require('../../.globals');
const { dirList } = require('../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('../lib/common');
const {xmlResources, txtResources} = require('./resources')

module.exports = {
    txtResources: unlogged(untimed(txtResources)),
    find: logged(untimed(find)),
    values: unlogged(untimed(values)),    
}

usage.db = `
node bg3 db:find:Data/Armor.txt Hat
node bg3 db:find:TreasureTable.txt Candle
node bg3 db:values:Data/Armor.txt Boosts
`

function find(resource, string) {
    debug('find', arguments)
    let res = timed(txtResources)(resource)
        .filter(e => 
            Object.keys(e)
                .map(i => string === undefined || e[i].indexOf(string) !== -1 || string === i && !!e[i])
                .reduce((a, b) => a || b));
    print(res.length, 'items found');
    return res;
}

function values(resource, prop) {
    let propMap = {};
    txtResources(resource).map(item => item[prop] ? propMap[item[prop]] = 1 : '');    
    let res = Object.keys(propMap);
    print(res.length, 'unique values found');
    return res;
}



