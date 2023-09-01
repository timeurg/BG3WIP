const {execSync} = require('child_process');
const fs = require('node:fs')
const color = require('./.js/lib/color')

console.log(new Date)

const commands = require(process.argv[2])

// console.log('-----')

commands.map(c => {
    console.log( color.yellow('\n>>>' + ( c.name || ('' + c).split('\n')[0])));
    try {
        let res;
        if (c instanceof Function) {
            res = c();
            if (res && res.run) {
                c = res.command;
            } else {
                c = null;
            }
        } 
        if (c) {
            res = execSync(c, {encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], env: {NOCOLOR: 1}});
            console.log(color.green('done'));
        }
        let out = res ? ('' + res).trim().split('\n') : [];
        if (out.length > 5) {
            out = [...out.slice(0,5), `... ${out.length - 5} lines hidden`]
        }
        console.log(color.grey(out.join('\n')));
    } catch (e) {
        console.log(color.red(e.stderr || e));
        process.exit(1);
    }
})

