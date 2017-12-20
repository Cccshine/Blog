const mongoose = require('mongoose');
const CommentSchema = require('../shcemas/comment');

const Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;