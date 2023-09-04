const {Base} = require('./Base');
const { log, print, debug, logged, timed, unlogged, untimed, usage, error } = require('../../lib/common');

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

module.exports = class Data extends Base {
    constructor(obj) {
        super({})
        obj && Object.keys(obj).map(k => this[propMap[k] || k] = obj[k])
    }

    
    toString() {
        return (Object.keys(this).map(k => `${rPropMap[k] || `data "${k}"`} "${Array.isArray(this[k]) ? this[k].join('"') : this[k]}"`).join("\r\n") + "\r\n")
    }

    getStorageByType(name) {
        return {
            Armor: `\\Public\\${name}\\Stats\\Generated\\Data`
        }[this.type]
    }

    static getByText(txt) {
        if (!txt) {
            error("Empty text")
        }
        const entry = new this();
        txt && txt.split("\r\n").map(line => {
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
    }

    static __quack(txt) {
        // print('Quack', txt.length, txt.trim().indexOf('new entry'))
        return txt && txt.trim().indexOf('new entry') === 0 ? Data : undefined
    }
}