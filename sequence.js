const {promisify} = require('util');
const {exec, execSync} = require('child_process');
const execAsync = promisify(exec);

console.log(new Date)

const commands = require(process.argv[2])

commands.map(c => {
    console.log('\x1B[34m' + c + '\x1B[0m');
    let res = execSync(c);
    console.log(res.toString('utf8'));
})

