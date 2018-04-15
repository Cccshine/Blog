const Emitter = require('events').EventEmitter;   
const emitter = new Emitter();

module.exports.emitter = emitter;