const fs = require('node:fs');
const path = require('node:path');
const { dirList } = require('../../lib/file');
const { log, print, debug, logged, timed, unlogged, untimed, usage } = require('../../lib/common');

module.exports = function xmlResources(filename) {
    if (!fs.existsSync(filename)) {
        error('File not found', filename);
    }
    // const xml = fs.readFileSync(filename, 'utf-8')
    // log(xml.substring(0,20))
    let head, tail, body, mode;
    const strict = true; // set to false for html-mode
    // const parser = sax.parser(strict);
    // parser.onerror = function (e) {
    //     error('Failed to parse file', filename, e)
    // };
    // parser.ontext = function (t) {
    // // got some text.  t is the string of text.
    //     log(t)
    // };
    // parser.onopentag = function (node) {
    //     log(node)
    // };
    // parser.onattribute = function (attr) {
    // // an attribute.  attr has "name" and "value"
    // };
    // parser.onend = function () {
    // // parser stream is done, and ready to have more stuff written to it.
    // };

    // parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();

    // stream usage
    // takes the same options as the parser
    class GameObject {


    }
    let buffer = {}, header = {};
    var saxStream = sax.createStream(strict)
    saxStream.on("error", function (e) {
        // unhandled errors will throw, since this is a proper node
        // event emitter.
        error("Failed to parse file", filename, e)
        // clear the error
        this._parser.error = null
        this._parser.resume()
    })
    saxStream.on("opentag", function (node) {
        log(node)
        // node.name == 'node' && log(node)
    // same object as above
    })
    // saxStream.on("text", function (text) {
    //     log(text)
    // // same object as above
    // })
    // pipe is supported, and it's readable/writable
    // same chunks coming in also go out.
    fs.createReadStream(filename)
    .pipe(saxStream)
    // .pipe(fs.createWriteStream("file-copy.xml"))
    
}