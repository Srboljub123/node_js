const ampAPI = require('../api/amp/amp-functions')
const sqlAPI = require('../api/mysql')

const updateUserInstances = async(user_id)=>{  
    return new Promise(async(resolve) => {
        let dbInstances = await sqlAPI.getInstancesbyUser(user_id)
        let ampInstanceData = await ampAPI.getInstances()
        let ampInstances = []
        let userInstances = []
        ampInstanceData.data.result.forEach(instance => {
            // console.log('Instance: ',instance.AvailableInstances);
            instance.AvailableInstances.forEach(availInstance=>{
                ampInstances.push(availInstance)
            })
        });

        if (dbInstances) {
            
            dbInstances.forEach(async(instance, i, arr) => {
                
                ampInstances.forEach(ampInstance => {
                    // console.log('ampInstance - ID', ampInstance.InstanceID)
                    // console.log('dbInstance -ID', dbInstances[i].instance_id);
                    if (ampInstance.InstanceID === dbInstances[i].instance_id) {
                        // console.log('UserInstance', ampInstance.Running);
                        userInstances.push(ampInstance)
                    }
                });
                // console.log(userInstances);
                userInstances.forEach(userInstance =>{
                    if (userInstance.Running != dbInstances[i].status) {
                        sqlAPI.updateInstance(dbInstances[i].instance_id,'status', userInstance.Running)
                    }
                })
            });
            dbInstances = await sqlAPI.getInstancesbyUser(user_id)
        }
        resolve(dbInstances)
    })
}

const getUserInstanceData = async(user_id)=>{
    
    return new Promise(async(resolve) => {
        let dbInstances = await sqlAPI.getInstancesbyUser(user_id)
        let ampInstanceData = await ampAPI.getInstances()
        let ampInstances = []
        let userInstances = []
        ampInstanceData.data.result.forEach(instance => {
            // console.log('Instance: ',instance.AvailableInstances);
            instance.AvailableInstances.forEach(availInstance=>{
                ampInstances.push(availInstance)
            })
        });

        if (dbInstances) {
            
            dbInstances.forEach(async(instance, i, arr) => {
                // console.log('dbInstance -ID', dbInstances[i].instance_id);
                ampInstances.forEach(ampInstance => {
                    // console.log('ampInstance - ID', ampInstance.InstanceID)
                    if (ampInstance.InstanceID === dbInstances[i].instance_id) {
                        // console.log('UserInstance Found');
                        userInstances.push(ampInstance)
                    }
                });
            });
        }
        resolve(userInstances)
    })
}

const startInstance = async(instance_id,instance_name)=>{
    
}


const start = async()=>{
    // await updateUserInstances('cus_LmjLWqZkqmP6le')
    // let instanceData = await getUserInstanceData('cus_Ln9nUzfrZ2H20y')
    // console.log(instanceData);
    // let instanceDetails = await ampAPI.getInstanceDetails('c7681612-da80-496b-8f80-bb9a77b7ea17')
    // console.log(instanceDetails.data);
}

module.exports={
    updateUserInstances,
    getUserInstanceData
}

start()