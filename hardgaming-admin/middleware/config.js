const config = require('../config/config.json');

const serverSettings = config.serverSettings;
const creds = config.credentials;
const dbConfig = config.database;
const amp = config.ampSettings

const getConfig = async (module) =>{

    return new Promise((resolve) => {
        switch (module) {
            case 'amp':
                resolve(amp)
                break;
            case 'server':
                resolve(serverSettings)
            case 'db':
                resolve(dbConfig)
            case 'stripe':
                resolve(creds.stripe)
            default:
                resolve(false)
                break;
        }
      })

    
}

module.exports = {
    getConfig
}