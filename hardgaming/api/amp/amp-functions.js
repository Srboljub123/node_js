// const { resolve } = require("path");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
var ampapi = require("@cubecoders/ampapi");
const config = require('../../middleware/config')
const mysqlAPI = require('../mysql');
const { resolve } = require("path");


let ampEndpoint=''

async function ampInit(){
    return new Promise(async(resolve) => {
        const ampConfig = await config.getConfig('amp');
        ampEndpoint = `http://${ampConfig.endpoint}:${ampConfig.port}/`
        const ampUsername = ampConfig.creds.username
        const ampPassword = ampConfig.creds.password
        var API = new ampapi.AMPAPI(ampEndpoint);
        try
        {
            //Perform first-stage API initialization.
            var APIInitOK = await API.initAsync();
            if (!APIInitOK) {
                console.log("API Init failed");
                resolve(false)
            }

            //The third parameter is either used for 2FA logins, or if no password is specified to use a remembered token from a previous login, or a service login token.
            var loginResult = await API.Core.LoginAsync(ampUsername, ampPassword, "", true);
            // console.log(loginResult);
            if (loginResult.success)
            {
                console.log("Login successful");
                API.sessionId = loginResult.sessionID;
                resolve(loginResult.sessionID)
                
            }
            else
            {
                console.log("Login failed");
                console.log(loginResult);
                resolve(false)
            }
        }catch (err)
        {
            console.log(ampEndpoint);
            console.log(err);
            resolve(false)
        }


    })
    
}

const ampToken = async()=>{
    return new Promise(async(resolve) => {
        const ampConfig = await config.getConfig('amp');
        ampEndpoint = `http://${ampConfig.endpoint}:${ampConfig.port}/`
        const ampUsername = ampConfig.creds.username
        const ampPassword = ampConfig.creds.password
        var API = new ampapi.AMPAPI(ampEndpoint);
        try
        {
            //Perform first-stage API initialization.
            var APIInitOK = await API.initAsync();
            if (!APIInitOK) {
                console.log("API Init failed");
                resolve(false)
            }

            //The third parameter is either used for 2FA logins, or if no password is specified to use a remembered token from a previous login, or a service login token.
            var loginResult = await API.Core.LoginAsync(ampUsername, ampPassword, "", true);
            // console.log(loginResult);
            if (loginResult.success)
            {
                console.log("Login successful");
                API.sessionId = loginResult.sessionID;
                resolve(loginResult.rememberMeToken)
                
            }
            else
            {
                console.log("Login failed");
                console.log(loginResult);
                resolve(false)
            }
        }catch (err)
        {
            console.log(ampEndpoint);
            console.log(err);
            resolve(false)
        }


    })
    
}

const createInstanceScript = async (gameID, serverName, customer_id) =>{
        let windowsOnly = ["Space Engineers","The Forest","Astoneer","The Isle","V Rising", "FiveM - GTA V Modification"]
        let linuxOnly = ["Avorion","Broke Protocol","kaboom!","Pavlov VR"]
        return new Promise(async (resolve) => {
            const game = await mysqlAPI.getGame(gameID)

             if (game) {
                const NewInstanceId = uuidv4();
                const InstanceName = serverName.replace(/\s/g, "");
                let configJSON = {}
        
                let sessionID = await ampInit();
                if (sessionID) {
                    let instanceConfig = await getInstanceConfig(sessionID, game.name)
                    let targetInstanceID
                    if (windowsOnly.indexOf(game.name) > -1) {
                        targetInstanceID = "be752a4f-f3d3-4cdd-ac5f-2370673e216d"
                    }else if (linuxOnly.indexOf(game.name) > -1) {
                        targetInstanceID = "dab0622b-c07f-404a-8eea-50aec3415a19"
                    }else{
                        targetInstanceID = "dab0622b-c07f-404a-8eea-50aec3415a19"
                    }
                    instanceConfig.Settings["GenericModule.App.RemoteAdminPort"]=1077

                    configJSON = {
                        "SESSIONID": sessionID,
                        "TargetADSInstance":targetInstanceID,
                        "NewInstanceId":NewInstanceId,
                        "Module":instanceConfig.ModuleName,
                        "InstanceName":InstanceName,
                        "FriendlyName":serverName,
                        "IPBinding":"0.0.0.0",
                        "PortNumber":"9058",
                        "AdminUsername":"admin",
                        "AdminPassword":"blah123!",
                        "ProvisionSettings":instanceConfig.Settings,
                        "AutoConfigure":true,
                        "DisplayImageSource": instanceConfig.DisplayImageSource,
                        "StartOnBoot":true,
                        "PostCreate":30
                    }
                    // console.log(configJSON);
                    let instance = await createInstance(configJSON, game, customer_id)
                    resolve(instance)
                }else{
                    resolve(false)
                }
            }else{
                resolve(false)
            }
        })
    


}

const getInstanceConfig = async (sessionID, game)=>{
    return new Promise(async (resolve) => {
        let instanceList = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/GetSupportedApplications`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                'SESSIONID':sessionID
            }
        })
        
        instanceList = instanceList.data.result
        for (let i = 0; i < instanceList.length; i++) {
            const instance = instanceList[i];
            if (instance.FriendlyName == game) {
                console.log(`${game} has been located`);
                resolve(instance)
                break;
            }
        }
    })
    
    

}

const createInstance = async (instanceScript, game, customer_id) => {
    return new Promise(async (resolve) => {
        

        const instance_id = instanceScript.NewInstanceId
        const target_instance = instanceScript.TargetADSInstance
        const user_id = customer_id
        const status = 0
        const game_id = game.name
        
        console.log("Adding to DB");
        const instanceDB = await mysqlAPI.addInstance(instance_id,target_instance,user_id,status, game_id)

        console.log("Creating Instance");
        if (instanceDB) {
            let instance = await axios({
                method: 'post',
                url:`${ampEndpoint}API/ADSModule/CreateInstance`,
                headers:{
                    'Accept':'text/javascript'
                },
                data:instanceScript
            })
            resolve(instance)
        }else{
            console.log('failed to post to DB');
            resolve(false)
        }
    })
}

const getInstanceDetails = async(instanceID) =>{
    return new Promise(async (resolve) => {
        const sessionID = await ampInit()

        let instance = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/GetInstance`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                "SESSIONID":sessionID,
                "InstanceId":instanceID
            }
        })
        resolve(instance)
    })
}

const getInstances = async() =>{
    return new Promise(async (resolve) => {
        const sessionID = await ampInit()
        console.log(sessionID);

        let instances = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/GetInstances`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                "SESSIONID":sessionID,
            }
        })
        resolve(instances)
    })
}

const startInstance = async(instanceName) => {
    return new Promise(async (resolve) => {
        const sessionID = await ampInit()
        console.log(sessionID);

        let instance = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/StartInstance`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                "SESSIONID":sessionID,
                "InstanceName":instanceName
            }
        })
        resolve(instance.status)
    })
}

const restartInstance = async(instanceName) => {
    return new Promise(async (resolve) => {
        const sessionID = await ampInit()
        console.log(sessionID);

        let instance = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/StartInstance`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                "SESSIONID":sessionID,
                "InstanceName":instanceName
            }
        })
        resolve(instance.status)
    })
}

const stopInstance = async(instanceName) => {
    return new Promise(async (resolve) => {
        const sessionID = await ampInit()
        console.log(sessionID);

        let instance = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/StopInstance`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                "SESSIONID":sessionID,
                "InstanceName":instanceName
            }
        })
        resolve(instance.status)
    })
}

const delInstance = async(instanceName) => {
    return new Promise(async (resolve) => {
        const sessionID = await ampInit()
        console.log(sessionID);

        let instance = await axios({
            method: 'post',
            url:`${ampEndpoint}API/ADSModule/DeleteInstance`,
            headers:{
                'Accept':'text/javascript'
            },
            data:{
                "SESSIONID":sessionID,
                "InstanceName":instanceName
            }
        })
        resolve(instance.status)
    })
}


const start = async()=>{
    
}


module.exports={
    ampInit,
    ampToken,
    createInstanceScript,
    getInstanceConfig,
    getInstanceDetails,
    getInstances,
    startInstance,
    restartInstance,
    stopInstance,
    delInstance
}