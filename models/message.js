const mongoose = require('mongoose');
const MessageSchema = require('../shcemas/message');

const Message = mongoose.model('Message',MessageSchema);

module.exports = Message;