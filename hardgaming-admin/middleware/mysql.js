const mysql = require('mysql');

const config = require('../config/config.json');
const dbConfig = config.database;

const connection = mysql.createConnection({
	host     : dbConfig.host,
	user     : dbConfig.username,
	password : dbConfig.password,
	database : dbConfig.db
});

const addService = async (name,shortdesc,users,price,avail,sku,img) =>{
    return new Promise((resolve) => {
        connection.query('INSERT INTO games(name,shortdesc,users,price,avail,sku,img) VALUES(?, ?, ?, ?, ?, ?, ?)', [name,shortdesc,users,price,avail,sku,img], function(error, results, fields) {
            if (error) throw error;
            console.log("1 record inserted");
            resolve(results)
        });
      })
}


module.exports = {
    addService
}