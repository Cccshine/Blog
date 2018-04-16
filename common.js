const Emitter = require('events').EventEmitter;   
const emitter = new Emitter();
emitter.setMaxListeners(20);
module.exports.emitter = emitter;