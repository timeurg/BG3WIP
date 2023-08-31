const modProps = {
    author: 'timeurg',
    name: 'BG3Transmog',
}

const settings = {
    locations: {
        workDir: `D:\\Games\\bg3mods`,
        gameDir: 'C:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3',
        unpackedGameAssets: {
            Shared: 'D:\\Games\\bg3GameLite\\Shared',
            Gustav: 'D:\\Games\\bg3GameLite\\Gustav.pak',
        },
    },
    LOG_LEVEL: process.env.LOG_LEVEL || process.env.LOG_LVL || 0,
}

module.exports = {modProps, settings}

// [
//     'D:\\Games\\bg3GameLite\\Shared\\Public\\Shared\\Stats\\Generated\\Data\\Armor.txt',
//     'D:\\Games\\bg3GameLite\\Shared\\Public\\SharedDev\\Stats\\Generated\\Data\\Armor.txt',
//     'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\Gustav\\Stats\\Generated\\Data\\Armor.txt',
//     'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\GustavDev\\Stats\\Generated\\Data\\Armor.txt'
// ];

// export const workDirPath = `D:\\Games\\bg3mods\\BG3Transmog\\Public\\BG3Transmog\\Stats\\Generated`

// export const gamePath = `C:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3\\Data\\Public\\BG3Transmog\\Stats\\Generated`







// export const gameAssetsPaths = [
//     'D:\\Games\\bg3GameLite\\Shared\\Public\\Shared\\Stats\\Generated\\Data\\Armor.txt',
//     'D:\\Games\\bg3GameLite\\Shared\\Public\\SharedDev\\Stats\\Generated\\Data\\Armor.txt',
//     'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\Gustav\\Stats\\Generated\\Data\\Armor.txt',
//     'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\GustavDev\\Stats\\Generated\\Data\\Armor.txt'
// ];

// export const workDirPath = `D:\\Games\\bg3mods\\BG3Transmog\\Public\\BG3Transmog\\Stats\\Generated`

// export const gamePath = `C:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3\\Data\\Public\\BG3Transmog\\Stats\\Generated`