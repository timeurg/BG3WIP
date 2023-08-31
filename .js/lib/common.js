const fs = require('node:fs');
const callsite = require('callsite');
const { isArguments } = require('lodash');
const red   = '\x1B[31m',
	blue  = '\x1B[34m', grey = '\x1B[90m',
	reset = '\x1B[0m';
function logwrap(f, LVL = 1) {
  const LOG_LEVEL = process.env.LOG_LEVEL || process.env.LOG_LVL || 0;
  return function(...args) {
    if (+LOG_LEVEL > LVL) return f.apply(f, [...args]);
  }
}

function line (...args){
  const stack = callsite()
  const place = grey + stack[2].getFileName() + ':' + stack[2].getLineNumber() + reset;
  // args = args.splice(1)
  console.log(place, ...args);
};
const log = logwrap(line);

// process.exit()

// const log = logwrap(function(...args){
//   console.log(...args);
//   // console.log(stack()[0].getFunctionName() || 'anonymous'
//   // , stack()[0].getFileName()
//   // , stack()[0].getLineNumber())
// });
// const log = logwrap(console.debug.bind(console, stack().map(s => s.getFileName()) + ':' + stack()[1].getLineNumber()));
const debug = logwrap(line, 2);

const count = logwrap(console.count.bind(console));
const error = (console.error.bind(console));
const print = console.log.bind(console);
const printed = []
const printOnce = (...arg) => printed.includes(JSON.stringify(arg)) || printed.push(JSON.stringify(arg)) + print(...arg)
const errored = []
const errorOnce = (...arg) => errored.includes(JSON.stringify(arg)) || errored.push(JSON.stringify(arg)) + error(...arg)

function lc(f, y, after = true, type = 'call') {
  const lcdebug = logwrap(console.debug.bind(console), 3);
  if (!f || !f.call && !f.apply) 
    return;
  // y('adsda')
  if (!f.prototype || !f.prototype.lc) {
    f.prototype = new Function();
    f.prototype.lc = {
      b: [],
      a: [],
    }
  }
  if (!f.name) {
    lcdebug('LC_ADD',  (after ? '_AFTER' : '_BEFORE'), ('' + f).substring(0,50).replaceAll('\n', ' '), (y.name ?? ('' + y).substring(0,20)).replace(/^bound /, '*').replaceAll('\n', ' '))
  } else {
    lcdebug('LC_ADD', f.name + (after ? '_AFTER' : '_BEFORE'), (y.name ?? ('' + y).substring(0,20)).replace(/^bound /, '*').replaceAll('\n', ' '))
  }
  
  if (y instanceof Function) {
    after ? f.prototype.lc.a.push(y) : f.prototype.lc.b.push(y)
  }
  function _wrap(thisArg, args) {
    lcdebug('LC_CALL_ARGS', args, f.call)
    f.prototype.lc.b.map(y => y.apply(y, args));
    lcdebug('LC_FIRE', 'BEFORE_' + f.name, f.prototype.lc.b.map(f => f.name))
    let res;
    if (type === 'call') {
      res = f.call(thisArg, ...args);
    } else {
      res =  f.apply(thisArg, args);
    }
    lcdebug('LC_FIRE', 'AFTER_' + f.name, f.prototype.lc.a.map(f => f.name))
    f.prototype.lc.a.map(y => y.apply(y, [res, ...args]));
    
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
  line: logwrap(line, -1),
  log, 
  debug, 
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