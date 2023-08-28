const fs = require('node:fs');
const path = require('node:path');
const { settings } = require('../../.globals');
const { dirList } = require('../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage, obj, cache } = require('../lib/common');
const {xmlResources, txtResources} = require('./resources')
const workplace = path.normalize(settings.locations.workDir + '/' + '.dbcache.js');
const dbCache = cache(workplace, obj());

module.exports = {
    txtResources: unlogged(untimed(txtResources)),
    find: logged(timed(find)),
    values: unlogged(untimed(values)),
    config: (name, val) => dbCache[name] = val
}

usage.db = `
node bg3 db:find:Data/Armor.txt Hat
node bg3 db:find:TreasureTable.txt Candle
node bg3 db:values:Data/Armor.txt Boosts
`

function find(resource, string) {
    let resources;
    debug('dbCache-start', dbCache.find)
    if (resource == 'last') {
        debug('last', dbCache.find.last)
        resources = timed(txtResources)(dbCache.find.last.resource)
        dbCache.find.last.history.map(
            s => resources = _find(resources, s)
        )
    } else {
        resources = timed(txtResources)(resource)
    }
    debug('find', arguments)
    function _find (resources, string) {
        let res = resources.filter(e => 
            Object.keys(e)
                    .map(i => string === undefined || e[i].toLowerCase().indexOf(string.toLowerCase()) !== -1 || string.toLowerCase() === i.toLowerCase() && !!e[i])
                    .reduce((a, b) => a || b));
        print(res.length, 'items found');
        return res;
    }
    const res = _find(resources, string)
    dbCache.find.last = {
        resource: resource == 'last' ? dbCache.find.last.resource : resource, 
        history: (resource == 'last' ? [...dbCache.find.last.history, string] : [string]).filter(i => i)
    }
    debug('dbCache-end', dbCache.find)
    return res;
}

function values(resource, prop) {
    let propMap = {};
    txtResources(resource).map(item => item[prop] ? propMap[item[prop]] = 1 : '');    
    let res = Object.keys(propMap);
    print(res.length, 'unique values found');
    return res;
}



