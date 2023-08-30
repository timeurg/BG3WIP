module.exports = function setProp(armor, prop, val, ifExists = true) {
    if (armor[prop] === undefined && ifExists) {
        return armor
    }
    armor[prop] = val
    return armor
}