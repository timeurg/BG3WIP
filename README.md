# BG3 Modding ToolBox
## What it is

This is a command-line utility tool to simplify Baldur's Gate 3 modders' lifes.
I know I didn't properly analyze the domain area, most of the things this toolbox does at the moment must have been solved ages ago.
But I just wanted to code a little, plus I do have big plans with this project.

## What it does

### Mod module
Provides mod building, testing and publishing commands

#### mod:lsx_locate

Finds lsx file by uuid

### DB module
Allows to search and analyze game database

#### db:find
Search for text in sourcefiles.
Try to find a hat:
`node bg3 db:find:Data/Armor.txt Hat`
Or all armor that grants stealth:
`node bg3 db:find:Data/Armor.txt 'Skill(Stealth'`

#### db:values
Analyze values of a property:
`node bg3 db:values:Data/Armor.txt Boosts`

#### --dump
All output can be dumped to file, but this is particularly useful with db module. You can dump to csv at the moment, lsx, Armors, Objects, Treasuretables incoming.
See what all armors in the game do:
`node bg3 db:find:Data/Armor.txt --dump test/Armor.csv`

## How to use

1. You have to know how to use https://github.com/Norbyte/lslib at the moment.
2. Install Node.js https://nodejs.org/en/download/current
3. Download and place this directory somewhere convinient.
4. Copy/Rename `.example.globals.js` to `.globals.js` and type in your values there
5. Win + R, type cmd, a terminal window will open
6. type `cd /d WHERE_YOU_PLACED_THIS`, hit enter
7. type `node bg3`, if everything went well a help message with available commands will be shown.

## Plans

### mod
* declarative style mod building and publication (already published https://www.nexusmods.com/baldursgate3/mods/1351 using this)
* publish
* merge-unmerge lsx
* container, treasuretable generation 
* visuals database scrapping and mix-and-match item generation
* savegame analyzer
* localization capabilities
* lslib integration?

### db
* localization parsing
* treasuretable, spell, etc parsing
* story/level scrapper
* npc analyzer
