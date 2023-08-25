module.exports = class XmlType {
    constructor (data) {
        this = Object.assign(this, data);
    }

    toString() {
        return '<xml/>'        
    }
}