var ampapi = require("@cubecoders/ampapi");
const config = require('../../middleware/config')

async function start(){
    const ampConfig = await config.getConfig('amp');
    const ampEndpoint = `http://${ampConfig.endpoint}/`
    const ampUsername = ampConfig.creds.username
    const ampPassword = ampConfig.creds.password
    const ampToken = ampConfig.token
    console.log(ampToken);
    var API = new ampapi.AMPAPI(ampEndpoint);
    try
    {
        //Perform first-stage API initialization.
        var APIInitOK = await API.initAsync();
        if (!APIInitOK) {
            console.log("API Init failed");
            return;
        }

        //The third parameter is either used for 2FA logins, or if no password is specified to use a remembered token from a previous login, or a service login token.
        var loginResult = await API.Core.LoginAsync(ampUsername, ampPassword, "", true);
        console.log(loginResult);
        if (loginResult.success)
        {
            console.log("Login successful");
            API.sessionId = loginResult.sessionID;
			
            //Perform second-stage API initialization, we only get the full API data once we're logged in.
            APIInitOK = await API.initAsync();
			
            if (!APIInitOK) {
                console.log("API Stage 2 Init failed");
                return;
            }
			
            //API call parameters are simply in the same order as shown in the documentation.
            // await API.ADSModule.CreateInstance(TargetADSInstance, NewInstanceId, Module, InstanceName, FriendlyName, IPBinding, PortNumber, AdminUsername, AdminPassword, ProvisionSettings, AutoConfigure)
            
            var currentStatus = await API.ADSModule.GetInstances();
            console.log(`Current CPU usage is: ${currentStatus.Metrics["CPU Usage"].Percent}%`);
        }
        else
        {
            console.log("Login failed");
            console.log(loginResult);
        }
    }
    catch (err)
    {
        console.log(ampEndpoint);
        console.log(err);
    }
}

start();