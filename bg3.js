const { settings } = require('./.globals');
const mod = require('./.js/mod');
const db = require('./.js/db');
const { log, debug, print, usage, obj, lcdebug, error, timed, logged, cache } = require('./.js/lib/common');
const fs = require('node:fs');
const path = require('node:path');
const csv = require('./.js/lib/csv')
const workplace = path.normalize(settings.locations.workDir + '/' + '.config.js');
const defaultConfig = obj();
defaultConfig.show = 5;
const config = cache(workplace, obj());

lcdebug(process.argv)

const modules = {
    help,
    config: (param, value) => config[param] = value,
    db,
    mod: mod(db),
    c: 'config',
}

const params = {
    '--dump' : {
        after: true,
        callback: function dumpToFile(filename, result, arguments, ) {
            try {
                filename = path.normalize(filename)
            } catch (e) {
                error('Cannot parse file location, try another')
                debug(arguments)
                return
            }
            debug(path.normalize(filename))
            log('dump', arguments)
            // return
            print('Dumping', call.name ?? 'result','to', filename)
            debug(result.length, arguments)            
            let contents = ''
            switch(path.extname(filename)) {
                case '.csv':
                    return timed(logged(csv))(filename, result)
                default:
                    // debug(result)
                    const toStr = (o) => '' + o == '[object Object]' ? JSON.stringify(o) : '' + o;
                    if (Array.isArray(result)) {
                        contents = result.map(toStr).join('\r\n')
                    } else {
                        contents = toStr(result)
                    }
            }
            return fs.writeFileSync(filename, contents);
        },
        help: `Save command result to file, e.g.:
node bg3 db:values:Data/Armor.txt Boosts --dump test/Boosts.csv
`
    }
}

function help () {
    print('### USAGE ###')
    Object.values(usage).map(m => m && print(m))    
    print('### AVAILABLE PARAMETERS ###')
    Object.keys(params).map(k => params[k].help ? print (k, params[k].help) : print(k))
    print('### CONTENTS ###')
    console.dir(modules)
    process.exit(1);
}


let input = process.argv[2];
if (!input) help();
let args = process.argv.splice(3);
let call;
let [command, ...addArgs] = input.split(':');
if (modules[command] === '' + modules[command]) {
    command = modules[command];
}
if (modules[command] && modules[command][addArgs[0]]) {
    debug('Module', command, 'command', addArgs[0])
    call = (modules[command])[addArgs[0]]
    print(addArgs)
    if(addArgs.length > 1) {
        args = [addArgs.splice(1).join(':'), ...args, ]
    }    
} else {
    debug('Command', command)
    call = modules[command]
}
if (call && call.apply) {
    const runParams = obj();
    args.map((arg, pos) => arg.indexOf('--')  === 0 && (runParams.params[pos] = arg)).filter(i => i)
    lcdebug(runParams)
    const LC_BEFORE = [], LC_AFTER = [];
    runParams.pos = Object.keys(runParams.params).map(k=>+k).sort((a,b) => a >b );
    if (runParams.pos[0]) {
        runParams.args = args.splice(runParams.pos[0])
        lcdebug(runParams)
        runParams.parsed = runParams.pos.map((k, i) => ({
                command: runParams.params[k],
                args: runParams.args.splice(1, runParams.pos[i + 1] ? runParams.pos[i + 1] - runParams.pos[i] : runParams.args.length) 
        }))
        runParams.parsed.map(p => 
            params[p.command] ? 
            (params[p.command].after ? 
                debug('LCA', p) || LC_AFTER.push(params[p.command].callback.bind(params[p.command].callback, ...p.args)) :
                LC_BEFORE.push(params[p.command].callback.bind(params[p.command].callback, ...p.args))
            ) 
            : log(p.command, 'not recognized'))
            lcdebug(runParams)
    }
    // return;
    debug('Executing', call.name)
    LC_BEFORE.map(f => f.apply(f, [call, args]))
    if (LC_BEFORE.length) debug(LC_BEFORE.length, 'before triggers fired')
    let result = call.apply(call, args)
    LC_AFTER.map(f => debug(f) || f.apply(f, [result, call, args]))
    if (LC_AFTER.length) debug(LC_AFTER.length, 'after triggers fired')
    debug(call.displayName ?? call.name, 'exited');
    if (result instanceof Array) {
        const display = result.length > config.show ? result.slice(0, config.show) : result
        print(display);
        print(result.length, 'rows total, first', display.length, 'shown')
    } else {
        print(result || '<Empty result set>')
    }
} else {    
    error('Something went wrong', call)
    help()
}
