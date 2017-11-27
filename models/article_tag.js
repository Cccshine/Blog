const mongoose = require('mongoose');
const TagSchema = require('../shcemas/article_tag');

const Tag = mongoose.model('Tag',TagSchema);

module.exports = Tag;