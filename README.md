# BG3 Modding ToolBox
## What it is

This is a command-line utility tool to simplify Baldur's Gate 3 modders' lifes.

I know I didn't properly analyze the domain area, most of the things this toolbox does at the moment must have been solved ages ago.
But I just wanted to code a little, plus I do have big plans with this project.

## What it does

### <a id="db"></a> DB module
Allows to search and analyze game database

|Command|Description|Examples|
|---|---|---|
db:find:{Resource}| Search for text in sourcefiles | Find all armor that grants stealth:<br>`node bg3 db:find:Data/Armor.txt 'Skill(Stealth'`<br>Or try to find a hat:<br>`node bg3 db:find:Data/Armor.txt Hat`<br>Narrow down your last search as many times as you want<br>`node bg3 db:find:last wiz`<br>`node bg3 db:find:last rich`<br>Find anything anywhere (As long as it is a bg3 file) ``<ber>Save results in mod-bound datasets (see [mod](#mod) module documentation) |
db:values | Analyze values of a property | `node bg3 db:values:Data/Armor.txt Boosts` |


You can configure how much entries are shown in console (doesn't affect commands, only presentation)

`node bg3 config show 10`

You can dump any output (the real result of a function, not what is shown) to a file:

`node bg3 db:find:Data/Armor.txt --dump test/Armor.csv`

This, for example will pop out a file, containing [all(find_1) armors in the game to a csv, which you can import into Excel or Google Docs for analysis.

[find_1] Those in whatever unpacked mod directories you mentioned in .globals.js actually

Dump respects file extention - csv will produce a csv, txt extention should produce gamefiles for txt-stored objects (like Armor, Inventory, etc), lsx would make proper game resources.

### <a id="mod"></a> Mod module
Provides mod building, testing and publishing commands

|Command|Description|Examples|
|---|---|---|
| mod:config | Configure a variable (mod-bound) | `node bg3 mod:config author timeurg` |
| mod:new | Creates a new mod in the working directory using template from ./.mod_bp/ | `node bg3 mod:new AwesomeMod` |
| mod:ls | Lists mods found in the working directory | `node bg3 mod:ls` |
| mod:set_active | Start or resume working on a mod in your working directory | Can look like `node bg3 mod:set_active AwesomeMod<v5>` if you have multiple versions of same mod in working directory |
| mod:lsx_locate | Finds lsx file by uuid. Uses active mod and pathes from .globals.js | `node bg3 mod:lsx_locate 0c0c1031-4a04-4e8f-ba8a-8aafa2a396e8` |
| mod:dataset | Make use of your *db:find*s with or without inbuilt and user defined mutations inside your AwesomeMod | `node bg3 mod:dataset toUnderwear --dump test/Boots.txt`<br> See [example](.doc/example.md)|
| mod:test | Launches the game with your AwesomeMod enabled, as much files uncompiled and pushed into game Data as we can. Some additional informartion on game session run can be found in ./logs, so analyze that))<br>I highly recommend [Skip Startup Videos](https://www.nexusmods.com/baldursgate3/mods/657) and [No Press Any Key Menu](https://www.nexusmods.com/baldursgate3/mods/745) for this, great mods. I look into []() | `node bg3 mod:test`


## How to use

1. You have to know how to use https://github.com/Norbyte/lslib at the moment. Unpack and run batch lsf -> lsx  conversion on Patch1.pac, Gustav.pak, Shared.pak and list them dirs in .globals.js at the minimum, add directories as you see fit in .globals.js or commands later.
2. Install Node.js https://nodejs.org/en/download/current
3. Download and place this directory somewhere convinient.
4. Copy/Rename `.example.globals.js` to `.globals.js` and type in your values there
5. Right-click your windows start icon choose Powershell or whatever looks most like it, a terminal window will open
6. type `cd /d WHERE_YOU_PLACED_THIS`, hit enter
5. type `npm i`, hit enter
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
** ~~armor~~
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

* mod:add:container
* mod:uuid2human
* ~~mod:test~~
* mod:publish
* wardrobe module that will blow your panties off
* save:get
* wardrobe:save

# Cool things to analyze

* https://github.com/Norbyte/bg3se/blob/main/Docs/API.md#getting-started
* https://github.com/ShinyHobo/BG3-Modders-Multitool/tree/develop
