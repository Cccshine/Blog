const mongoose = require('mongoose');
const CommentSchema = require('../shcemas/article_comment');

const Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;