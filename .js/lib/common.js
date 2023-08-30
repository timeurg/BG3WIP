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
const printed = []
const printOnce = (...arg) => printed.includes(JSON.stringify(arg)) || printed.push(JSON.stringify(arg)) + print(...arg)
const errored = []
const errorOnce = (...arg) => errored.includes(JSON.stringify(arg)) || errored.push(JSON.stringify(arg)) + error(...arg)

function lc(f, y, after = true) {
  if (!f || !f.call)
    return;
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
    lcdebug('LC_CALL_ARGS', args, f.call)
    f.prototype.lc.b.map(y => y.apply(y, args));
    lcdebug('LC_FIRE', 'BEFORE_' + f.name, f.prototype.lc.b.map(f => f.name))
    let res = f.call(thisArg, ...args);
    f.prototype.lc.a.map(y => y.apply(y, args));
    lcdebug('LC_FIRE', 'AFTER_' + f.name, f.prototype.lc.a.map(f => f.name))
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
  log(`cache-save-${filename}`, cache)
  fs.writeFileSync(filename, 'module.exports = ' + JSON.stringify(cache))
}
const cache = (filename, def) => {
  if(!fs.existsSync(filename)){
    saveCache(def, filename)
  }
  let o = require(filename)
  log(`cache-${filename}`, o)

  function set (target, key, value, receiver) {
    log(value, value === Object(value))
    log(`cache-set-${filename}`, key, value)
    Reflect.set(target, key, typeof value !== 'object' ? value : new Proxy(value,
      {
          set,
      }
    ))
    saveCache(o, filename)
  } 
  return new Proxy(o,
      {
          set,
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
  printOnce,
  errorOnce,
}