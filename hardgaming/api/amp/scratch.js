let configJSON = {
        "SESSIONID": "8b272301-46df-4064-aed1-07fb3c90cbca",
        "TargetADSInstance":"dab0622b-c07f-404a-8eea-50aec3415a19",
        "NewInstanceId":NewInstanceId,
        "Module":"srcds",
        "InstanceName":InstanceName,
        "FriendlyName":serverName,
        "IPBinding":"0.0.0.0",
        "PortNumber":"9058",
        "AdminUsername":"admin",
        "AdminPassword":"blah123!",
        "ProvisionSettings":{
            "srcdsModule.SRCDS.Map": "cp_well",
            "srcdsModule.SRCDS.ServerType": "Team Fortress 2 Dedicated Server",
            
        },
        "AutoConfigure":true,
        "DisplayImageSource": "steam:440"
    }
    resolve(configJSON)


    
    
    switch (game) {
        case "7 Days to Die":
            configJSON = {
                "SESSIONID": "8b272301-46df-4064-aed1-07fb3c90cbca",
                "TargetADSInstance":"dab0622b-c07f-404a-8eea-50aec3415a19",
                "NewInstanceId":NewInstanceId,
                "Module":"SevenDays",
                "InstanceName":InstanceName,
                "FriendlyName":serverName,
                "IPBinding":"0.0.0.0",
                "PortNumber":"9058",
                "AdminUsername":"admin",
                "AdminPassword":"blah123!",
                "ProvisionSettings":{
                },
                "AutoConfigure":true,
                "DisplayImageSource": "steam:251570"
            }
            
            break;
        case "Alien Swarm":
            configJSON = {
                "SESSIONID": "8b272301-46df-4064-aed1-07fb3c90cbca",
                "TargetADSInstance":"dab0622b-c07f-404a-8eea-50aec3415a19",
                "NewInstanceId":NewInstanceId,
                "Module":"srcds",
                "InstanceName":InstanceName,
                "FriendlyName":serverName,
                "IPBinding":"0.0.0.0",
                "PortNumber":"9058",
                "AdminUsername":"admin",
                "AdminPassword":"blah123!",
                "ProvisionSettings":{
                    "srcdsModule.SRCDS.ServerType": "Alien Swarm Dedicated Server"
                },
                "AutoConfigure":true,
                "DisplayImageSource": "steam:630"
            }
            break;
        case "Alien Swarm: Reactive Drop":
            configJSON = {
                "SESSIONID": "8b272301-46df-4064-aed1-07fb3c90cbca",
                "TargetADSInstance":"dab0622b-c07f-404a-8eea-50aec3415a19",
                "NewInstanceId":NewInstanceId,
                "Module":"srcds",
                "InstanceName":InstanceName,
                "FriendlyName":serverName,
                "IPBinding":"0.0.0.0",
                "PortNumber":"9058",
                "AdminUsername":"admin",
                "AdminPassword":"blah123!",
                "ProvisionSettings":{
                    "srcdsModule.SRCDS.ServerType": "Alien Swarm: Reactive Drop Dedicated Server"
                },
                "AutoConfigure":true,
                "DisplayImageSource": "steam:563560"
            }
            break;
        case "ARK: Survival Evolved":
            configJSON = {
                "SESSIONID": "8b272301-46df-4064-aed1-07fb3c90cbca",
                "TargetADSInstance":"dab0622b-c07f-404a-8eea-50aec3415a19",
                "NewInstanceId":NewInstanceId,
                "Module":"ARK",
                "InstanceName":InstanceName,
                "FriendlyName":serverName,
                "IPBinding":"0.0.0.0",
                "PortNumber":"9058",
                "AdminUsername":"admin",
                "AdminPassword":"blah123!",
                "ProvisionSettings":{
                },
                "AutoConfigure":true,
                "DisplayImageSource": "steam:346110"
            }
            break;
        case "ARMA III":
            configJSON = {
                "SESSIONID": "8b272301-46df-4064-aed1-07fb3c90cbca",
                "TargetADSInstance":"dab0622b-c07f-404a-8eea-50aec3415a19",
                "NewInstanceId":NewInstanceId,
                "Module":"Arma3",
                "InstanceName":InstanceName,
                "FriendlyName":serverName,
                "IPBinding":"0.0.0.0",
                "PortNumber":"9058",
                "AdminUsername":"admin",
                "AdminPassword":"blah123!",
                "ProvisionSettings":{
                },
                "AutoConfigure":true,
                "DisplayImageSource": "steam:107410"
            }
            break;
        default:
            break;
    }
    resolve(configJSON)