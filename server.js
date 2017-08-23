var express = require("express");
var path = require("path");

var app = express();
//设置应用程序的静态路径
app.use(express.static(path.join(__dirname,"/views")));
app.listen(3000,function(){
    console.log("Started listening on port", 3000);
})
// var http = require('http');
// var MongoClient = require('mongodb').MongoClient;
// var DB_CONN_STR = 'mongodb://localhost/runoob';

// var insertData = function(db,callback){
// 	var collection = db.collection('site');
// 	var data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
// 	collection.insert(data,function(err,result){
// 		if(err){
// 			console.log('Error'+err);
// 			return;
// 		}
// 		callback(result);
// 	});
// }
// MongoClient.connect(DB_CONN_STR,function(err,db){
// 	console.log('连接成功');
// 	insertData(db,function(result){
// 		console.log(result);
// 		db.close()
// 	})
// })

// http.createServer(function(request,response){
// 	response.writeHead(200,{'Content-Type':'text/plain'});
// 	response.end('Hello World')
// }).listen(8888);
// console.log('Server running at http://127.0.0.1:8888/');