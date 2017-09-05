module.exports = {
    port: 4000,
    session: {
        secret: 'cshine',
        key: 'cshine',
        resave:false,
        rolling:true,
        saveUninitialized:false,
        maxAge: 2592000000,
    },
    mongodb: 'mongodb://localhost:27017/runoob'
};