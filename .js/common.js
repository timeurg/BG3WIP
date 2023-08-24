const { modProps, settings } = require('../.globals');
function logwrap(f, LVL = 0) {
  return function(...args) {
    if (settings.LOG_LEVEL > LVL) return f.apply(f, args);
  }
}
const log = logwrap(console.log.bind(console));
const debug = logwrap(console.debug.bind(console), 1);
const count = logwrap(console.count.bind(console));
const error = (console.error.bind(console));

function lc(f, y, after = true) {
  if (!f.prototype || !f.prototype.lc) {
    f.prototype = new Function();
    f.prototype.lc = {
      b: [],
      a: [],
    }
  }
  debug('LC_ADD' + f.name, f, y, after)
  if (y instanceof Function) {
    after ? f.prototype.lc.a.push(y) : f.prototype.lc.b.push(y)
  }
  function _wrap(thisArg, args) {
    f.prototype.lc.b.map(y => y.apply(y, args));
    debug('LC_FIRE_BEFORE', f.name, f.prototype.lc.b.length)
    let res = f.call(thisArg, ...args);
    f.prototype.lc.a.map(y => y.apply(y, args));
    debug('LC_FIRE_AFTER', f.name, f.prototype.lc.a.length)
    return res;
  }
  f.apply = _wrap;
  return f;
}

function logged (f) {
  return lc(lc(f, console.groupCollapsed.bind(console, f.name), false), console.groupEnd.bind(console, f.name));  
}
const unlogged = (f) => f

function timed (f) {
  return lc(lc(f, console.time.bind(console, f.name), false), console.timeEnd.bind(console, f.name));  
  function _wrap(thisArg, args) {
    console.time(this.name);
    let res = f.call(thisArg, args);
    console.timeEnd(this.name);
    return res;
  }
  f.apply = _wrap;
  return f;
}
const untimed = (f) => f

function dumpable (f) {
  function _wrap(thisArg, args) {
    let res = f.call(thisArg, args);
    return res;
  }
  f.apply = _wrap;
  return f;
}

const obj = () =>
 new Proxy({},
   {
     get: (target, key, receiver) => (
        key == 'toJSON'
          ? () => target
          : (
              Reflect.has(target, key) ||
              Reflect.set(target, key, emptyObj()),
              Reflect.get(target, key, receiver)
            )
     )
   }
)

const usage = {};

module.exports = { 
  log, 
  debug,
  print: console.log.bind(console),
  error,
  count,
  obj,
  usage,
  logged,
  unlogged,
  timed,
  untimed,
}