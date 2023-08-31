const fs = require('node:fs');
const stack = require('callsite');
const red   = '\x1B[31m',
	blue  = '\x1B[34m',
	reset = '\x1B[0m';
const settings = require('../../.globals');
function logwrap(f, LVL = 1) {
  // const s = stack()[0].getFileName()
  const s = '-->'
  return function(...args) {
    if (+settings.LOG_LEVEL > LVL) return f.apply(f, [s, ...args]);
  }
}


const log = logwrap(function(...args){
  console.log(...args);
  // console.log(stack()[0].getFunctionName() || 'anonymous'
  // , stack()[0].getFileName()
  // , stack()[0].getLineNumber())
});
// const log = logwrap(console.debug.bind(console, stack().map(s => s.getFileName()) + ':' + stack()[1].getLineNumber()));
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

function lc2(f, y, after = true) {
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
  function _wrap(thisArg, ...args) {
    lcdebug('LC_CALL_ARGS', args, f.call)
    f.prototype.lc.b.map(y => y.apply(y, args));
    lcdebug('LC_FIRE', 'BEFORE_' + f.name, f.prototype.lc.b.map(f => f.name))
    let res = f.apply(thisArg, args);
    f.prototype.lc.a.map(y => y.apply(y, [res, ...args]));
    lcdebug('LC_FIRE', 'AFTER_' + f.name, f.prototype.lc.a.map(f => f.name))
    return res;
  }
  f.call = _wrap;
  return f;
}

const log2 = (function(...args){
  // console.log(arguments);
  const place = args[0][1].getFileName() + ':' + args[0][1].getLineNumber()
  args = args.splice(1)
  console.log(place, ...args);
  // console.log(stack()[0].getFunctionName() || 'anonymous'
  // , stack()[0].getFileName()
  // , stack()[0].getLineNumber())
});
const line = lc2(stack, log2.bind(log2)).call.bind(stack)


function logged (f) {
  return lc(lc(f, console.groupCollapsed.bind(console, f.name), false), console.groupEnd.bind(console, f.name));  
}
const unlogged = (f) => f

function timed (f) {
  return lc(lc(f, console.time.bind(console, f.name), false), console.timeEnd.bind(console, f.name));  
}
const untimed = (f) => f

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
  line,
}