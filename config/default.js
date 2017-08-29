module.exports = {
    port: 4000,
    session: {
        secret: 'cshine',
        key: 'cshine',
        resave:false,
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/runoob'
};