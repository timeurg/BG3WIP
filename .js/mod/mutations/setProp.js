module.exports = function setProp(armor, prop, val, ifExists = true) {
    console.log(arguments, !!ifExists)
    ifExists = (ifExists === '0') ? false : true
    if (armor[prop] === undefined && !!ifExists) {
        return armor
    }
    armor[prop] = val
    return armor
}