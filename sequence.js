const {execSync} = require('child_process');
const fs = require('node:fs')
const color = require('./.js/lib/color')

console.log(new Date)

const commands = require(process.argv[2])

console.log('-----')

commands.map(c => {
    console.log(color.yellow(c));
    try {
        let res = execSync(c, {encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], env: {NOCOLOR: 1}});
        let out = res.split('\n');
        if (out.length > 5) {
            out = [...out.slice(0,5), `... ${out.length - 5} lines hidden`]
        }
        console.log(color.green('done'));
        console.log(color.grey(out.join('\n')));
    } catch (e) {
        console.log('\x1B[31m' + e.stderr + '\x1B[0m');
        fs.writeFileSync('test/woo', JSON.stringify(e))
        process.exit(1);
    }
})

