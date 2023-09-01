const { log, print, count, error, logged, timed, unlogged, untimed, usage, debug, cache } = require('../lib/common');
const settings = cache('../../.globals');
const path = require('node:path');
const fs = require('node:fs');
const { dirList } = require('../lib/file');
const sax = require("../lib/sax");
const readdir = require("node:fs");
const { randomUUID } = require('node:crypto');
const readline = require('readline-sync')

module.exports = (config, db, runtime, dataset) => function addObject(type, name, ...params) {
    let res;
    switch (type) {
        case 'TreasureTable':
            const [resource, ...tail] = params;
            const items = db.find(dsName, ...tail);
            
            break;
        default: error(`Unknown object type ${type}`)
    }
    return res;
}