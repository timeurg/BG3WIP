const fs = require('node:fs');
const path = require('node:path');

const { dirList } = require('../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage, obj, cache } = require('../lib/common');
const settings = cache('../../.globals');
const {xmlResources, txtResources} = require('./resources')
const workplace = path.normalize(settings.workDir + '/' + '.dbcache.js');
const dbCache = cache(workplace, obj());
const find = require('./find')

module.exports = {
    txtResources: unlogged(untimed(txtResources)),
    find: logged(timed(find(dbCache, txtResources))),
    values: unlogged(untimed(values)),
    config: (name, val) => dbCache[name] = val
}

usage.db = `
node bg3 db:find:Data/Armor.txt Hat
node bg3 db:find:TreasureTable.txt Candle
node bg3 db:values:Data/Armor.txt Boosts
node bg3 db:find:'E:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3\\Data\\Public\\BasketEquipmentNSFW\\Stats\\Generated\\Data\\Armor.txt' using:_foot --dump Boots.txt
`



function values(resource, prop) {
    let propMap = {};
    txtResources(resource).map(item => item[prop] ? propMap[item[prop]] = 1 : '');    
    let res = Object.keys(propMap);
    print(res.length, 'unique values found');
    return res;
}



