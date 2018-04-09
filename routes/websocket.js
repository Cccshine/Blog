const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserModel = mongoose.model('User');


router.ws('/avatar', (ws, req) => {
  ws.on('message', (msg) => {
  	console.log(msg)
  	UserModel.findOne({name:req.session.username}).then((user) => {
  		ws.send(user.avatar);
	}).catch((err) =>{
	    console.log(err);
	});
  });
})

module.exports = router;