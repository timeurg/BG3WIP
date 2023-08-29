# BG3 Modding ToolBox
## What it is

This is a command-line utility tool to simplify Baldur's Gate 3 modders' lifes.

I know I didn't properly analyze the domain area, most of the things this toolbox does at the moment must have been solved ages ago.
But I just wanted to code a little, plus I do have big plans with this project.

## What it does

### <a id="db"></a> DB module
Allows to search and analyze game database

#### db:find:{Resource}
Search for text in sourcefiles.

Find all armor that grants stealth:
`node bg3 db:find:Data/Armor.txt 'Skill(Stealth'`

Or try to find a hat:
`node bg3 db:find:Data/Armor.txt Hat`

Narrow down your last search as many times as you want

`node bg3 db:find:last wiz`

`node bg3 db:find:last rich`

Save results in mod-bound datasets (see [mod](#mod) module documentation)

You can configure how much entries are shown in console (doesn't affect commands, only presentation)

`node bg3 config show 10`

#### db:values
Analyze values of a property:
`node bg3 db:values:Data/Armor.txt Boosts`

#### --dump
All output can be dumped to file, but this is particularly useful with db module. You can dump to csv at the moment.

See what all armors in the game do:
`node bg3 db:find:Data/Armor.txt --dump test/Armor.csv`

### <a id="mod"></a> Mod module
Provides mod building, testing and publishing commands

#### mod:config
Dont forget to set your mod's:
* author


#### mod:new
Creates a new empty mod in the working directory

`node bg3 mod:new AwesomeMod`

#### mod:ls
List mods found in the working directory

#### mod:set_active
Start working on a mod from the list

#### mod:lsx_locate

Finds lsx file by uuid

#### mod:dataset

Save db search results in mod-bound datasets for later use

#### mod:add

Add a new entity to active mod

#### mod:dataset

See [example](.doc/example.md)

#### mod:test

Run the game with active mod enabled

## How to use

1. You have to know how to use https://github.com/Norbyte/lslib at the moment.
2. Install Node.js https://nodejs.org/en/download/current
3. Download and place this directory somewhere convinient.
4. Copy/Rename `.example.globals.js` to `.globals.js` and type in your values there
5. Win + R, type cmd, a terminal window will open
6. type `cd /d WHERE_YOU_PLACED_THIS`, hit enter
7. type `node bg3`, if everything went well a help message with available commands will be shown.

## Credits

Huge thanks to
* Larian for making an amazing game
* [AnteMaxx](https://www.nexusmods.com/baldursgate3/users/100288838) for making amazing mods that inspired me to delve into modding
* [Norbyte](https://github.com/Norbyte) for his great tools


## Plans

### mod
* declarative style mod building and publication (already published https://www.nexusmods.com/baldursgate3/mods/1351 using a prototype of this toolset)
* publish
* merge-unmerge-humanize lsx
* container, treasuretable generation 
* visuals database scrapping and mix-and-match item generation
* savegame analyzer
* localization capabilities
* lslib integration?

### db
* Models for
** armor
** treasuretable, inventory
** loc
** spells
** weapons
** GameObjects
** npc
** sfx
* Notable objects
Shared.pak\Mods\Shared\EquipmentSettings\EquipmentSlots.lsx

## Roadmap

* mod:grab
* mod:add:container
* mod:uuid2human
* mod:test
* mod:publish
* wardrobe:grab
* wardrobe:add
* wardrobe:del
* wardrobe:split
* save:get
* wardrobe:save
