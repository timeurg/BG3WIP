const {Base} = require('../models/Base')
const Data = require('../models/Data')
const { log, print, debug, logged, timed, unlogged, untimed, usage, error, printOnce } = require('../../lib/common');
const fs = require('node:fs');
const __tests = []
fs.readdirSync(__dirname)
    .filter(t => t !== 'index.js')
    .map(t => require(__dirname + '/' + t))
    .filter(T => T.__quack)//.map(p => debug(p) || p)
    .map(T => __tests.push(T.__quack) + (module.exports[T.name] = T))


let warned = false;

class Model {
    static getByText(txt) {
        const type = __tests.map(f => f(txt)).reduce((a,b) => a || b, undefined);
        // printOnce(__tests, type);
        if (type && type.getByText) {
            return type.getByText(txt)
        } else {
            warned || (warned = true) && error('Could not determine entry type', txt)
        }
    }
}

module.exports = {
    Model,
    Data,
}