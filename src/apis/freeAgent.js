  //Standard function to get all records from a FreeAgent App
  export const getFAAllRecords = async (FAClient, appName) => {
    console.log("FAClient: ",FAClient)
    console.log("appName:", appName)
    
    try {
        let data = [];
        const response = await FAClient.listEntityValues({
            entity: appName,
        })
        console.log(response)

        response.map(record => {
            let rowData = {id: record.id};
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.display_value;
                if (typeof val == "object") {
                    val = JSON.stringify(value.display_value);
                }
                rowData = {...rowData, ...{ [key]: val } };
            });
            data.push(rowData);
        });
        return data;
    } catch (error) {
        console.log(error)
    }
};


//Standard function to get specific records from a FreeAgent App
export const getFARecords = async (FAClient,appName, fields, filters, order, limit, offset, pattern)=>{

    try {
        let data = [];
        const response = await new Promise((resolve, reject) => {
            FAClient.listEntityValues({
                entity: appName,
                fields : fields, // List of fields (["seq_id", "description", "created"])
                filters : filters, //[{field_name : "total_amount",operator : "equals",values : [0]}],
                order : order,
                limit : limit,
                offset : offset, // row offset
                pattern : pattern
            }, (response) => {
                console.log('Connection successful: ', response);
                if (response) {
                    resolve(response);
                } else {
                    reject("No response from server");
                }
            });
        });

        response.forEach(record => {
            let rowData = {};

            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.display_value;
                if (typeof val == "object") {
                    val = JSON.stringify(value.display_value);
                }
                rowData = { ...rowData, ...{ [key]: val } };
            });
            data.push(rowData);
        });
        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Standard function to add a new record in a FreeAgent App
export const addFARecord = async (FAClient,appName, formData)=>{

   //Only send fields where the formData maps the fields in the app
   let updatedFormData = {};

   try {
    const appData = await getFAAllRecords(FAClient, appName);
    console.log("app data to check fields against: ", appData)
    if (appData.length > 0) {
        const fields = Object.keys(appData[0]);
        Object.keys(formData).map(item=>{
            if(fields.includes(item)){
                updatedFormData = {...updatedFormData,...{[item]:formData[item]}};
            }
        })
        console.log("Updated formData", updatedFormData);

        const response = await new Promise((resolve, reject) => {
            FAClient.createEntity({
                entity: appName,
                field_values: updatedFormData
            }, (response) => {
                console.log('Connection successful: ', response);
                if (response) {
                    resolve(response);
                } else {
                    reject("No response from server");
                }
            });
        });
        return response
    }
    } catch (error) {
        console.error("Error fetching data:", error);
    }   
}


// Update record in FreeAgent
export const updateFARecord = async (FAClient, appName, recordId, formData) => {
    
    try {
        const response = await FAClient.updateEntity({
            entity: appName,
            id: recordId,
            field_values: formData
        })
        return response
    } catch (error) {
        throw new Error("Error updating data: " + error);
    }
};


//Update or delete a record in a Free Agent app
export const deleteFARecord = async (FAClient, appName, recordId) => { 

    try {
        const response =  await FAClient.updateEntity({
            entity: appName,
            id: recordId,
            field_values: {
                deleted: true
            },
    })
        return response
    } catch (error) {
        throw new Error("Error deleting data: " + error);
    }
}

  //Standard function to get a user's data from FreeAgent
//   export const getCurrentUserData = async (FAClient) => {
//     console.log(FAClient)
//     try{
//         const response = await FAClient.getUserInfo()
//         console.log(response)
//         return response
//     }catch(error){
//         console.log(error)
//     }
// }

  //Standard function to get a user's data from FreeAgent
//   export const getAllUserData = async (FAClient) =>{
//     try{
//         const response = await FAClient.getTeamMembers()
//         return response
//     }catch(error){
//         console.log(error)
//     }
//   }

