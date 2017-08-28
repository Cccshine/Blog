const express = require('express');
const Mongolass = require('mongolass');
const bodyParser = require('body-parser');
const config = require('config-lite')(__dirname);

const app = express();
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/', indexRouter);
app.use('/register', registerRouter);

app.listen(4000);

