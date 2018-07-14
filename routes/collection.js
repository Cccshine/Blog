const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ArticleModel = mongoose.model('Article');

router.post('/',function(req,res){
	let {subjectId,uid} = req.body;
	ArticleModel.findOneAndUpdate({_id:subjectId},{$addToSet: {collectionUser: uid}}).then(() => {
		return res.json({"status":1,"msg":"collection success"});
	}).catch((err) => {
		//console.log(err);
		res.status(500).send('Something broke!');
	});
});

router.delete('/',function(req,res){
	let {subjectId,uid} = req.body;
	ArticleModel.findOneAndUpdate({_id:subjectId},{$pull: {collectionUser: uid}}).then(() => {
		return res.json({"status":1,"msg":"cancle collection success"});
	}).catch((err) => {
		//console.log(err);
		res.status(500).send('Something broke!');
	});
});

module.exports = router;