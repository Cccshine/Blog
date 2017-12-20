const mongoose = require('mongoose');
const TagSchema = require('../shcemas/tag');

const Tag = mongoose.model('Tag',TagSchema);

module.exports = Tag;