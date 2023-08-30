module.exports = function toCampClothes(armor) {
    if (armor.using == '_Foot') {
        armor.Slot = 'VanityBoots'
        armor.using = "ARM_Camp_Shoes"
    } else {
        armor.Slot = 'Underwear'
        armor.using = "ARM_Underwear"
    }
    return armor
}