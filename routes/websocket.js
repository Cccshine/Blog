const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserModel = mongoose.model('User');
const MessageModel = mongoose.model('Message');
// const Emitter = require('events').EventEmitter;   
// const emitter = new Emitter();

module.exports = router;