const fs = require('node:fs');
const { log, print, debug, timed, unlogged, untimed, count } = require('./common');

module.exports = function csv(filename, arr) {

    const header = []
    if(!arr instanceof Array) {
        throw Error('Cannot convert to csv')
    }
    arr.map((line, index) => 
        (index < 2 && debug('line', csvline(line))) + count('lines') +
        fs.appendFileSync(filename + '~', csvline(line) + '\r\n')
        //  + process.exit()
    )
    if (header.length) {
        fs.writeFileSync(filename, csvline(header) + '\n')
        fs.appendFileSync(filename, fs.readFileSync(filename + '~'))
        fs.unlinkSync(filename + '~')
    } else {
        fs.renameSync(filename + '~', filename)
    }
    print('Saved result to tab-separated csv, enjoy')

    function csvline(obj) {
        const sanitize = (str) => '\"' + str.replaceAll('\"','\"\"') + '\"'
        if (obj instanceof Array) {
            return obj.map(sanitize).join ('\t')
        } else if (obj instanceof Object) {
            const keys = Object.keys(obj);
            if (header.length === 0) header.push(...keys) 
            const val = [].fill('', 0, header.length)
            keys.map(k => header.indexOf(k) === -1 ? header.push(k) + val.push(obj[k]) : val[header.indexOf(k)] = obj[k])       
            return csvline(val)
        } else 
            return '' + obj
    }
}
