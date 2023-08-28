const settings = {
    locations: {
        workDir: `D:\\Games\\bg3mods`,
        gameDir: 'C:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3',
        unpackedGameAssets: {
            Shared: 'D:\\Games\\bg3GameLite\\Shared',
            Gustav: 'D:\\Games\\bg3GameLite\\Gustav.pak',
        },
    },
    LOG_LEVEL: process.env.LOG_LEVEL || 0,
}

module.exports = {settings}