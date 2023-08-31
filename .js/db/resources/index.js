const txtResources = require('./txtResources')
const xmlResources = require('./xmlResources')
const fs = require('node:fs');
const path = require('node:path');
const { dirList } = require('../../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('../../lib/common');

module.exports = {
    resources,
    txtResources,
    xmlResources,
}

function resources(filename) {

}