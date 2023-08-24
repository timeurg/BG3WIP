const { modProps, settings } = require('../.globals');
const { log, print, count, error, logged, timed, unlogged, untimed, usage } = require('./common');
const path = require('node:path');
const fs = require('node:fs');
const { dirList } = require('./file');
const sax = require("./sax");

module.exports = {
    lsx_locate: logged(timed(lsx_locate)),
    unmerge: logged(timed(unmerge)),
}

usage.mod = `
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
    if (!fs.existsSync(filename)) {
        error('File not found', filename);
    }
    const xml = fs.readFileSync(filename, 'utf-8')
    let head, tail, body, mode;
    strict = true, // set to false for html-mode
    parser = sax.parser(strict);
    parser.onerror = function (e) {
        error('Failed to parse file',e)
    };
    parser.ontext = function (t) {
    // got some text.  t is the string of text.
    };
    parser.onopentag = function (node) {
        log(node)
    };
    parser.onattribute = function (attr) {
    // an attribute.  attr has "name" and "value"
    };
    parser.onend = function () {
    // parser stream is done, and ready to have more stuff written to it.
    };

    parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();

    // stream usage
    // takes the same options as the parser
    var saxStream = require("sax").createStream(strict)
    saxStream.on("error", function (e) {
        // unhandled errors will throw, since this is a proper node
        // event emitter.
        error("SAX Error", e)
        // clear the error
        this._parser.error = null
        this._parser.resume()
    })
    saxStream.on("opentag", function (node) {
    // same object as above
    })
    // pipe is supported, and it's readable/writable
    // same chunks coming in also go out.
    fs.createReadStream(filename)
    .pipe(saxStream)
    .pipe(fs.createWriteStream("file-copy.xml"))
    
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