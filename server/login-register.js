var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost/runoob';

var insertData = function(db,callback){
	var collection = db.collection('site');
	var data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
	collection.insert(data,function(err,result){
		if(err){
			console.log('Error'+err);
			return;
		}
		callback(result);
	});
}
MongoClient.connect(DB_CONN_STR,function(err,db){
	console.log('连接成功');
	insertData(db,function(result){
		console.log(result);
		db.close()
	})
})

// http.createServer(function(request,response){
// 	response.writeHead(200,{'Content-Type':'text/plain'});
// 	response.end('Hello World')
// }).listen(8888);
// console.log('Server running at http://127.0.0.1:8888/');