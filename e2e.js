const {resolve} = require('node:path');

const modname = `TestMod` + (new Date).getTime();
console.log(modname)

module.exports = [
    `node bg3`,

    `node bg3 config show 0`,
    
    `node bg3 mod:ls`,

    `node bg3 mod:clear`,

    `node bg3 mod:new ${modname}`,
    
    `node bg3 mod:set_active ${modname}`,
    
    `node bg3 mod:dataset:from Hats Data/Armor.txt hat setProp:Weight:0:1 toCampClothes`,
    
    `node bg3 mod:dataset:ls`,
    
    `node bg3 mod:dataset:get Hats --dump test/Hats.txt`,
    
    process.env.TERM ? `tail -n 10 test/Hats.txt` : resolve('./.misc/tail.cmd') + ' ' + resolve('test/Hats.txt'),

    `node bg3 mod:clear`,

    `node bg3 mod:rm ${modname} --yes`,
]