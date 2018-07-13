const Emitter = require('events').EventEmitter;   
const emitter = new Emitter();
var articleTotal = 0;

module.exports.emitter = emitter;
module.exports.articleTotal = articleTotal;