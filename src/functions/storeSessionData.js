
export const storeSessionData = (stateData)=>{
    Object.keys(stateData).map(key=>{
        localStorage.setItem(key, stateData[key]); // Store a key-value pair
    })
}

