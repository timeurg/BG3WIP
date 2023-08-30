const { error } = require("../../lib/common")
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('../../lib/common');

const fs = require('node:fs');

// .map(d => print(d))

// print(fs.readdirSync(__dirname).map(t => t !== 'Base.js' && require(__dirname + '/' + t)))

class Base {
    constructor(obj) {
        Object.assign(this, obj)
    }

}

module.exports = {Base};