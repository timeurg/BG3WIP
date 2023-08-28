const fs = require('node:fs');
const { settings } = require('../../.globals');
function logwrap(f, LVL = 1) {
  return function(...args) {
    if (settings.LOG_LEVEL > LVL) return f.apply(f, args);
  }
}
const log = logwrap(console.log.bind(console));
const debug = logwrap(console.debug.bind(console), 2);
const lcdebug = logwrap(console.debug.bind(console), 3);
const count = logwrap(console.count.bind(console));
const error = (console.error.bind(console));
const print = console.log.bind(console);

function lc(f, y, after = true) {
  if (!f.prototype || !f.prototype.lc) {
    f.prototype = new Function();
    f.prototype.lc = {
      b: [],
      a: [],
    }
  }
  if (!f.name) {
    lcdebug('LC_ADD', 'UNKNOWN', ('' + f).substring(0,20))
  } else {
    lcdebug('LC_ADD', f.name + (after ? '_AFTER' : '_BEFORE'), (y.name ?? ('' + y).substring(0,20)).replace(/^bound /, '*'))
  }
  
  if (y instanceof Function) {
    after ? f.prototype.lc.a.push(y) : f.prototype.lc.b.push(y)
  }
  function _wrap(thisArg, args) {
    f.prototype.lc.b.map(y => y.apply(y, args));
    lcdebug('LC_FIRE', 'BEFORE' + f.name, f.prototype.lc.b.length)
    let res = f.call(thisArg, ...args);
    f.prototype.lc.a.map(y => y.apply(y, args));
    lcdebug('LC_FIRE', 'AFTER' + f.name, f.prototype.lc.a.length)
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
              Reflect.set(target, key, obj()),
              Reflect.get(target, key, receiver)
            )
     )
   }
)

function saveCache(cache, filename) {
  fs.writeFileSync(filename, 'module.exports = ' + JSON.stringify(cache))
}
const cache = (filename, def) => {
  if(!fs.existsSync(filename)){
    saveCache(def, filename)
  }
  const o = require(filename)
  const set = (target, key, value, receiver) => {
    debug('setCache', target, key, value)
    Reflect.set(target, key, value)
    saveCache(o, filename)
  } 
  const get = (target, key, receiver) => (
    key == 'toJSON'
    ? () => target
    : (
        Reflect.has(target, key) ||
        set(target, key, new Proxy({},{set,get})),
        Reflect.get(target, key, receiver)
        )
  )
  return new Proxy(o,
      {
          set,
          get
      }
  );
}

const usage = {};

module.exports = { 
  log, 
  debug, lcdebug,
  print,
  error,
  count,
  obj,
  usage,
  logged,
  unlogged,
  timed,
  untimed,
  cache,
}