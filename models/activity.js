const mongoose = require('mongoose');
const ActivitySchema = require('../shcemas/activity');

const Activity = mongoose.model('Activity',ActivitySchema);

module.exports = Activity;