const { settings } = require('../../.globals');
const { log, print, count, error, logged, timed, unlogged, untimed, usage, debug, errorOnce } = require('../lib/common');
const path = require('node:path');
const fs = require('node:fs');
const { dirList } = require('../lib/file');
const sax = require("../lib/sax");
const readdir = require("node:fs");
const { randomUUID } = require('node:crypto');
const readline = require('readline-sync')

module.exports = (config, db, runtime) => {
    const mod = config.active
    debug('Active mod', mod)
    const datasetPath = mod.project + '/datasets';
    return {
        ls: () => {
            runtime.showAll = true;
            return fs.readdirSync(datasetPath + '/')
                        .filter(f => path.extname(f) !== '.meta')
                        .map(f => f.replace('.json', ''))
        },
        new: (name, source, query) => {
            const res = db.find(source, query);
            if (!fs.existsSync(datasetPath)) {
                fs.mkdirSync(datasetPath)
            }
            fs.writeFileSync(datasetPath + '/' + name + '.json', JSON.stringify(res, undefined, 2));
            const meta = {
                type: res[0].constructor.name,
                command: [name, source, query]
            };
            fs.writeFileSync(datasetPath + '/' + name + '.meta', JSON.stringify(meta));
            print('Saved to', path.normalize(datasetPath + '/' + name + '.json'))
            return res
        },
        get: (name) => {
            const res = JSON.parse(fs.readFileSync(datasetPath + '/' + name + '.json', 'utf-8'));
            const meta = JSON.parse(fs.readFileSync(datasetPath + '/' + name + '.meta', 'utf-8'));
            const models = require('./../db/models');
            if (models[meta.type]) {
                return res.map(i => new models[meta.type](i))
            } else {
                error('Dataset is untyped')
                return res;
            }
        },
        mutate: function mutate(name, ...mutations) {
            debug(arguments)
            const res = module.exports(config, db).get(name);
            return res.map(i => {
                let res = i;
                mutations.map(m => {
                    m = m.split(':');
                    try {
                        let mutation = require('./mutations/' + m[0])
                        res = mutation(i, ...m.slice(1))
                    } catch (e) {
                        errorOnce(`Mutation ${m[0]}: ${e}`)
                    }                
                })
                return res;
            }).flat()
        },
        from: (name, source, query, ...mutations) => {
            module.exports(config, db).new(name, source, query)
            return module.exports(config, db).mutate(name, ...mutations)
        }
    }
}

