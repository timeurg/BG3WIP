
const mod = require('./.js/mod');
const db = require('./.js/db');
const { log, debug, print, usage } = require('./.js/common');

print('Welcome to BG3 Modding Toolbox\n');
debug(process.argv)

const modules = {
    help,
    mod,
    db,
}

function help () {
    print('### USAGE ###')
    Object.values(usage).map(m => m && print(m))    
    print('### CONTENTS ###')
    console.dir(modules)
    process.exit(1);
}

let input = process.argv[2];
if (!input) help();
let args = process.argv.splice(3);
let call;
const [command, ...addArgs] = input.split(':');
if (modules[command] && modules[command][addArgs[0]]) {
    debug('Module', command, 'command', addArgs[0])
    call = (modules[command])[addArgs[0]]
    args = [...addArgs.splice(1), ...args, ]
} else {
    debug('Command', command)
    call = modules[command]
}
if (call instanceof Function) {
    debug('Executing', call.name)
    let result = call.apply(call, args)
    debug(call.displayName ?? call.name, 'exited');
    if (result instanceof Array) {
        print(result.slice(0, 15));
        print(result.length, 'rows')
    } else {
        print(result || '<Empty result set>')
    }
} else {    
    error('Something went wrong', call)
    help()
}
