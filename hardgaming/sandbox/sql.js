const mysql = require('mysql');

const config = require('../config/config.json');

const dbConfig = config.database;

const con = mysql.createConnection({
	host     : dbConfig.host,
	user     : dbConfig.username,
	password : dbConfig.password,
	database : dbConfig.db
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });