
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const TagModel = mongoose.model('Tag');

router.post('/',function(req,res){
	
});

router.get('/',(req,res) => {
	TagModel.find(null).then((tagList) => {
		console.log('tagList:'+tagList);
		if(tagList.length > 0){
			return res.json({"status":1,"tagList":tagList,"msg":"get success"});
		}else{
			return res.json({"status":0,"tagList":tagList,"msg":"no tag"});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send('Something broke!');
	})
})


module.exports = router;