const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserModel = mongoose.model('User');
const MessageModel = mongoose.model('Message');

module.exports = router;