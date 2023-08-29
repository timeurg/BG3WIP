const { settings } = require('../../.globals');
const { cache, log, print, count, error, logged, timed, unlogged, untimed, usage, obj, debug } = require('../lib/common');
const path = require('node:path');
const fs = require('node:fs');
const { dirList } = require('../lib/file');
const sax = require("../lib/sax");
const newMod = require('./new')
const { spawn } = require('node:child_process');
const workplace = path.normalize(settings.locations.workDir + '/' + '.worksettings.js');
const defaultWorkSettings = obj();
const workSettings = cache(workplace, defaultWorkSettings);
const _ = require('lodash')

module.exports = (db) => ({
    lsx_locate: logged(timed(lsx_locate)),
    // unmerge: logged(timed(unmerge)),
    new: logged(timed(newMod(workSettings))),
    ls: () => {
        return fs.readdirSync(settings.locations.workDir)
            .filter(dir => fs.existsSync(`${settings.locations.workDir}/${dir}/Mods/`))
            .map(dir => fs.readdirSync(`${settings.locations.workDir}/${dir}/Mods/`).map(mod => [mod, dir])).flat()
            .map(([mod, dir]) => mod == dir ? [mod, mod, dir] : [`${mod}[${dir}]`, mod, dir])
            .map(([modhandle, mod, dir]) => [modhandle, mod, dir, path.normalize(`${settings.locations.workDir}/${dir}/Mods/${mod}/meta.lsx`)])
            .filter(([modhandle, mod, dir, meta]) => fs.existsSync(meta))
            .map(([modhandle, mod, dir, meta]) => ({ 
                modhandle,
                name: mod,
                meta,
            }))
    },
    show: (name) => {
        name = name || workSettings.active.name;
        spawn('explorer.exe', [path.normalize(settings.locations.workDir + '/' + name)]);
    },
    test: () => {
        //@TODO build a minimal pak and enable, copy all able-to load unpacked files to settings.locations.gameDir /Data
        // option to disable other mods
        // vulkan option
        const out = fs.openSync('./logs/out.log', 'a');
        const err = fs.openSync('./logs/err.log', 'a');
        const child = spawn(
            path.normalize(settings.locations.gameDir + '/bin/bg3_dx11.exe'), 
            ['--skip-launcher'], 
            {
                cwd: path.normalize(settings.locations.gameDir + '/bin'),
                detached: true, 
                stdio: [ 'ignore', out, err ]
            });
        child.unref();
    },
    set_active: (modhandle) => {
        const mod = module.exports.ls().filter(m => m.modhandle == modhandle)
        workSettings.active = mod;
        return mod;
    },
    dataset: (...mutations) => {
        const res = db.find('last');
        return res.map(i => {
            mutations.map(m => {
                try {
                    let mutation = require('./mutations/' + m)
                    i = mutation(i)
                } catch (e) {
                    print(`Mutation ${m} not found`)
                }                
            })
            return i;
        })
    },
    dedupe(donor, ...files) {
        let res = db.find(donor);
        debug(res.length, 'items in original')
        files.map(f => {
            let exist = db.find(f);
            debug(exist.length, 'items in ', f);
            res = _.differenceBy(res, exist, (a) => a.name)
            debug(res.length, 'items left in original')
        })
        print(res.length, 'items left in original')
        return res;
    },
    config: (name, val) => name ? workSettings[name] = val : print(workSettings),
    c: 'config',
})

usage.mod = `
node bg3 mod:ls
node bg3 mod:new AwesomeMod
node bg3 mod:set_active AwesomeMod

node bg3 test

node bg3 mod:lsx_locate 0c0c1031-4a04-4e8f-ba8a-8aafa2a396e8
node bg3 mod:unmerge test/merged.lsx
`

function lsx_locate (uuid) {
    // log(dirList)
    let res = dirList().map(dir => dir + '/RootTemplates/' + uuid + '.lsx').map((filename) => {
        count('Locations searched');
        // log(filename)
        if (fs.existsSync(filename)) {
            print('Found at', filename)
        }
        return fs.existsSync(filename)  ? path.normalize(filename) : ''
    }).filter(i => i != '').join(path.delimiter);
    return res;
}

function unmerge(filename) {

}





function all() {
    fs.writeFileSync(`${targetResources[0]}\\TreasureTable.txt`,
    `new treasuretable "DEN_Entrance_Trade"
CanMerge 1`);
    let res1 = head();
    let res = [res1.length + ' of heads']
    res1 = body();
    res = [...res, res1.length + ' of bodies']
    res1 = legs();
    res = [...res, res1.length + ' of legs']
    return res
}



function head () {
    db = commands['lsx_ls']();
    let helmets = [
        ...commands.find('Helm'),
        ...commands.find('Hat'),
        ...commands.find('Head'),
        ...commands.find('Mask'),
        ...commands.find('Scarf'),
        // ...commands.find('Helm'),
    ];
    helmets = helmets.sort((a,b)=> a.name > b.name)
    // return  helmets.filter((i,k) => helmets[k+1] && i.name == helmets[k+1].name ? log(i,helmets[k+1]) : null);
    fs.unlinkSync(`${targetResources[0]}\\Data\\Helmets.txt`);
    fs.writeFileSync(`${targetResources[0]}\\Data\\Helmets.txt`,'')

    helmets.map(i => {
        fs.appendFileSync(
        `${targetResources[0]}\\Data\\Helmets.txt`, 
        `
new entry "${i.name}_UNDERWEAR"
using "_Head"
data "Slot" "Underwear"
data "RootTemplate" "${i.RootTemplate}"
data "Weight" "0.01"
data "Rarity" "Legendary"
`
        );
        fs.appendFileSync(
        `${targetResources[0]}\\TreasureTable.txt`, 
            `
new subtable "1,1"
object category "I_${i.name}_UNDERWEAR",1,0,0,0,0,0,0,0`
        );
    }
    );
    return helmets;
}

function body () {
    db = commands['lsx_ls']();
    let helmets = [
        ...commands.find('Cloth'),
        ...commands.find('Robe'),
        ...commands.find('Body'),
        ...commands.find('Armor'),
        // ...commands.find('Helm'),
        // ...commands.find('Helm'),
    ];
    // return helmets;
    fs.unlinkSync(`${targetResources[0]}\\Data\\Body.txt`);
    fs.writeFileSync(`${targetResources[0]}\\Data\\Body.txt`,'')
    helmets.map(i => {
        fs.appendFileSync(
        `${targetResources[0]}\\Data\\Body.txt`, 
        `
new entry "${i.name}_CAMP"
using "ARM_Camp_Body"
data "Slot" "VanityBody"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ClothingCommon"
data "Weight" "0.01"
data "Rarity" "Legendary"

new entry "${i.name}_CAMP2"
using "ARM_Camp_Body"
data "Slot" "VanityBody"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ClothingRich"
data "Weight" "0.01"
data "Rarity" "Legendary"
`
        );
        fs.appendFileSync(
        `${targetResources[0]}\\TreasureTable.txt`, 
            `
new subtable "1,1"
object category "I_${i.name}_CAMP",1,0,0,0,0,0,0,0`
        );
    }
    );
    return helmets;
}

function legs () {
    db = commands['lsx_ls']();
    let helmets = [
        ...commands.find('Boot'),
        ...commands.find('Shoes'),
        ...commands.find('fffff'),
        // ...commands.find('Helm'),
        // ...commands.find('Helm'),
    ];
    if(fs.existsSync(`${targetResources[0]}\\Data\\Legs.txt`)) fs.unlinkSync(`${targetResources[0]}\\Data\\Legs.txt`);
    fs.writeFileSync(`${targetResources[0]}\\Data\\Legs.txt`,'')
    helmets.map(i => {
        fs.appendFileSync(
        `${targetResources[0]}\\Data\\Legs.txt`, 
        `
new entry "${i.name}_CAMPBOOT"
using "ARM_Camp_Shoes"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ShoesCommon"
data "Weight" "0.01"
data "Rarity" "Legendary"

new entry "${i.name}_CAMPBOOT2"
using "ARM_Camp_Shoes"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ShoesRich"
data "Weight" "0.01"
data "Rarity" "Legendary"
`
        );
        fs.appendFileSync(
        `${targetResources[0]}\\TreasureTable.txt`, 
            `
new subtable "1,1"
object category "I_${i.name}_CAMPBOOT",1,0,0,0,0,0,0,0`
        );
    }
    );
    return helmets;
}