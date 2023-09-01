const color = (code) => (text) => process.env.NOCOLOR == '1' ? text : `\x1B[${code}m${text}\x1B[0m`
module.exports = {
    color,
    red: color(31),
    blue: color(34),
    grey: color(90),
    green: color(92),
    yellow: color(93),
    reset: color(0)
}