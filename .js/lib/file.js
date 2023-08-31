const { log, print, logged, timed, unlogged, untimed, debug, cache } = require('./common');
const settings = cache('../../.globals');
const config = require(settings.workDir + '/.config.js')
const path = require('node:path');
const fs = require('node:fs');
const csv = require('./csv')

function dirList () {
    let filenames = [
        // settings.workDir + '/' + modProps.name + '/Public/' + modProps.name,
        ...Object.keys(config.unpackedGameAssets).map(gameMod => 
            ['','Dev'].map(type => gameMod + type)
            .map((dirName) => 
                (config.unpackedGameAssets[gameMod] + '/Public/' + dirName)
            )
        ),
    ].flat().map(f => path.normalize(f));
    log(filenames);
    return filenames;
}

function dumpToFile(filename, result, arguments, ) {
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
}

module.exports = { 
    dirList: unlogged(untimed(dirList)),
    dumpToFile: logged(dumpToFile),
}