const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "ohunm00fjsjs1uzy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "edr0nabd2lowlfxj",
    password: "jtxvr8bleoo0zdd7",
    database: "b87oedcp2kz46q50"
});

module.exports = pool;