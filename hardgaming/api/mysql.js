const mysql = require('mysql');

const config = require('../config/config.json');
const dbConfig = config.database;

const connection = mysql.createConnection({
	host     : dbConfig.host,
	user     : dbConfig.username,
	password : dbConfig.password,
	database : dbConfig.db
});

const getGame = async (id) =>{
    return new Promise((resolve) => {
        connection.query('SELECT * FROM games WHERE id = ?', [id], function(error, results, fields) {
            if (results.length > 0) {
                // console.log(results);
                resolve(results[0])
            }else{
                resolve(false)
            };
        });
      })
}

const getGamebyName = async (name) => {
    return new Promise((resolve) => {
        connection.query('SELECT * FROM games WHERE name = ?', [name], function(error, results, fields) {
            if (results.length > 0) {
                
                resolve(results[0])
            }else{
                resolve(false)
            };
        });
    })
}

const getGames = async() => {

    return new Promise((resolve) => {
        connection.query('SELECT * FROM games', function(error, results, fields) {
            if (results.length > 0) {
                resolve(results)
            }else{
                resolve(false)
            };
        });
      })
    
}

const getTopGames = async(count) => {

    return new Promise((resolve) => {
        connection.query('SELECT * FROM games ORDER BY ID ASC LIMIT ?',[count], function(error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                resolve(results)
            }else{
                resolve(false)
            };
        });
      })
    
}

const addIntent = async (paymentIntent, customerID) =>{
    return new Promise((resolve) => {
        connection.query('INSERT INTO intents (paymentIntent_id,status,customer_id) VALUES (?, ?, ?)', [paymentIntent.id, 0, customerID], function(error, results, fields) {
            if (error) {
                resolve(false)
                console.log(error);
            }else{
                console.log(results);
                resolve(true)
            };
        });
    })
}

const updateIntent = async (paymentIntent, status) =>{
    return new Promise((resolve) => {
        connection.query('UPDATE intents SET status=? WHERE paymentIntent_id=?', [status,paymentIntent.id], function(error, results, fields) {
            if (error) {
                resolve(false)
                console.log(error);
            }else{
                console.log(results);
                resolve(true)
            };
        });
      })
}

const getIntent = async (id) =>{
    return new Promise((resolve) => {
        connection.query('SELECT * FROM intents WHERE paymentIntent_id = ?', [id], function(error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                resolve(results[0])
            }else{
                resolve(false)
            };
        });
      })
}

const delIntent = async (id) =>{
    return new Promise((resolve) => {
        connection.query('DELETE FROM intents WHERE paymentIntent_id = ?', [id], function(error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                resolve(results[0])
            }else{
                resolve(false)
            };
        });
      })
}

const addInstance = async(instance_id,target_instance,user_id,status, game_id) =>{
    return new Promise(async (resolve) => {
        console.log("Getting Game Image");
        const game = await getGamebyName(game_id)
        console.log(game);
        const img = game.img
        console.log("Inserting Instance to DB");
        connection.query('INSERT INTO instances (instance_id,target_instance,user_id,status, game_id, img) VALUES (?, ?, ?, ?, ?, ?)', [instance_id,target_instance,user_id,status, game_id, img], function(error, results, fields) {
            if (error) {
                console.log(error);
                resolve(false)
                
            }else{
                console.log(results);
                resolve(true)
            };
        });
    })
}

const updateInstance = async (instance_id, field, value) =>{
    return new Promise((resolve) => {
        connection.query(`UPDATE instances SET ${field}=? WHERE instance_id=?`, [value,instance_id], function(error, results, fields) {
            if (error) {
                resolve(false)
                console.log(error);
            }else{
                console.log(results);
                resolve(true)
            };
        });
      })
}

const getInstancesbyUser = async (user_id) =>{
    return new Promise((resolve) => {
        connection.query('SELECT * FROM instances WHERE user_id = ?', [user_id], function(error, results, fields) {
            if (results.length > 0) {
                // console.log(results);
                resolve(results)
            }else{
                resolve(false)
            };
        });
      })
}

const getInstancesbyTarget = async (target_instance) =>{
    return new Promise((resolve) => {
        connection.query('SELECT * FROM instances WHERE target_instance = ?', [target_instance], function(error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                resolve(results)
            }else{
                resolve(false)
            };
        });
      })
}

const getInstancebyID = async (instance_id) =>{
    return new Promise((resolve) => {
        connection.query('SELECT * FROM instances WHERE instance_id = ?', [instance_id], function(error, results, fields) {
            if (results.length > 0) {
                console.log(results[0]);
                resolve(results[0])
            }else{
                resolve(false)
            };
        });
    })
}

const delInstancebyID = async (instance_id) => {
    return new Promise((resolve) => {
        connection.query('DELETE FROM instances WHERE instance_id = ?', [instance_id], function(error, results, fields) {
            if (results.length > 0) {
                console.log(results);
                resolve(results[0])
            }else{
                resolve(false)
            };
        });
    })
}

const start = async() =>{
   let top = await getTopGames(6);
   console.log(top);
}

module.exports = {
    getGame,
    getGames,
    addIntent,
    updateIntent,
    getIntent,
    delIntent,
    addInstance,
    updateInstance,
    getInstancebyID,
    getInstancesbyTarget,
    getInstancesbyUser,
    getGamebyName,
    delInstancebyID,
    getTopGames
}