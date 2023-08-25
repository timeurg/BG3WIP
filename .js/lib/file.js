const { modProps, settings } = require('../../.globals');
const { log, print, logged, timed, unlogged, untimed } = require('./common');
const path = require('node:path');
const fs = require('node:fs');

function dirList () {
    let filenames = [
        // settings.locations.workDir + '/' + modProps.name + '/Public/' + modProps.name,
        ...Object.keys(settings.locations.unpackedGameAssets).map(gameMod => 
            ['','Dev'].map(type => gameMod + type)
            .map((dirName) => 
                (settings.locations.unpackedGameAssets[gameMod] + '/Public/' + dirName)
            )
        ),
    ].flat().map(f => path.normalize(f));
    log(filenames);
    return filenames;
}

module.exports = { 
    dirList: unlogged(untimed(dirList)),
}