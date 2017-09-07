const mongoose = require('mongoose');
const ArticleSchema = require('../shcemas/article');

const Article = mongoose.model('Article',ArticleSchema);

module.exports = Article;