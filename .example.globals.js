const settings = {
    locations: {
        workDir: `D:\\_src\\bg3mods`,
        gameDir: 'C:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3',
        unpackedGameAssets: {
            Patch1: 'D:\\_src\\bg3GameLite\\Patch1',
            Shared: 'D:\\_src\\bg3GameLite\\Shared',
            Gustav: 'D:\\_src\\bg3GameLite\\Gustav',
            Localization: 'D:\\_src\\bg3GameLite\\Localization',
        },
    },
    LOG_LEVEL: process.env.LOG_LEVEL || process.env.LOG_LVL || 0,
}

module.exports = {settings}