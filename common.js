const faye = require('faye');
const pub = new faye.Client('http://localhost:4000');
pub.connect();

module.exports.pub = pub;