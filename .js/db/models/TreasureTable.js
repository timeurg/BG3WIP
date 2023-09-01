const {Base} = require('./Base');
const { log, print, debug, logged, timed, unlogged, untimed, usage, error } = require('../../lib/common');
return;
`
new treasuretable "Clothes_Poor_Random_Supply"
new subtable "2,1;3,2;4,1"
object category "T_Clothes_Poor_Random",1,0,0,0,0,0,0,0

new treasuretable "Clothes_Poor_Hat"
new subtable "1,1"
object category "T_Clothes_Medium_Hat",1,0,0,0,0,0,0,0

new treasuretable "Clothes_Medium_Hat"
new subtable "1,1"
object category "I_ARM_Hat",1,0,0,0,0,0,0,0
object category "I_ARM_Hat_Wizard_B",1,0,0,0,0,0,0,0
object category "I_ARM_Hat_Wizard_D",1,0,0,0,0,0,0,0
object category "I_ARM_Hat_MuffinHat_A",1,0,0,0,0,0,0,0
object category "I_ARM_Hat_MuffinHat_B",1,0,0,0,0,0,0,0

new treasuretable "TUT_Chest_Potions"
CanMerge 1
new subtable "1,1"
object category "I_AMX_SUMMON_BASKET_AMULET",1,0,0,0,0,0,0,0

new treasuretable "AMX_SUMMONED_BASKET_TT"
new subtable "1,1"
object category "I_AMX_SUMMONED_BASKET_PERM_1",1,0,0,0,0,0,0,0
new subtable "1,1"
object category "I_AMX_SUMMONED_BASKET_PERM_2",1,0,0,0,0,0,0,0


new treasuretable "AMX_SUMMONED_BASKET_PERM_TT"
new subtable "1,1"
object category "I_AMX_OBJ_Backpack_ShortsOutfits",1,0,0,0,0,0,0,0
new subtable "1,1"
object category "I_AMX_OBJ_Backpack_BlackOutfits",1,0,0,0,0,0,0,0
new subtable "1,1"
`

`new treasuretable "AMX_CHEST_1_TT"
new subtable "1,1"
object category "I_AMX_SUMMON_BASKET_AMULET",1,0,0,0,0,0,0,0
new subtable "1,1"
object category "I_AMX_OBJ_Backpack_ShortsOutfits",1,0,0,0,0,0,0,0
new subtable "1,1"
object category "I_AMX_OBJ_Backpack_BlackOutfits",1,0,0,0,0,0,0,0
`

const propMap = {
    'new treasuretable': 'name',
    type: 'type',
    using: 'using'
}, rPropMap = {};
Object.keys(propMap).map(k => rPropMap[propMap[k]] = k)

module.exports = class TreasureTable extends Base {
    CanMerge = 1
    subtables = [
    ]

    static fromString(txt) {
        const res = new this()
        txt = txt.split('\r\n')
        res.name = txt[0].replace('new treasuretable','').replace('"', '').trim()
        if (txt[1] == 'CanMerge 1') {
            res.CanMerge = 1;
            txt = txt.slice(2);
            log(txt)
        }
    }
    
    toString() {
        let res = `new treasuretable "${this.name}"` + this.CanMerge == 1 ? '\r\nCanMerge 1\r\n' : '';
        this.subtables.map({})
    }


    static getByText(txt) {
        if (!txt) {
            error("Empty text")
        }
        const entry = new this();
        txt && txt.split("\r\n").map(line => {
            // print(line)
            let prop = line.substring(0, line.indexOf(' "'));
            // log(prop)
            let data = line.replace(prop, '');
            data = data.trim().substring(1, data.length - 2);     
            data = data.split('" "');
            if (prop == 'data') {
                prop = data[0];
                data = data.slice(1);
            }
            entry[propMap[prop] ?? prop] = data.length > 1 ? data : data[0];
        })
        return entry;
    }

    static __quack(txt) {
        // print('Quack', txt.length, txt.trim().indexOf('new entry'))
        return txt && txt.trim().indexOf('new entry') === 0 ? Data : undefined
    }
}