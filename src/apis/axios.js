import axios from "axios";
console.log(`Environment: ${process.env.NODE_ENV}`);

export const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"

export default axios.create({
  baseURL,
})

export const dbUrl = axios.create({
  baseURL,
})

//General Query
export const getData = async (query, res)=>{
  try{
    const result = await dbUrl.post("/db/query",{query})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Get Table
export const getTable = async (tableName)=>{
  
    try{
      const result = await dbUrl.get(`/db/table/${tableName}`)
      console.log(result.data)
      const {data,dataTypes} = await result.data
      return ({data,dataTypes})
    }catch(error){
      console.log(error)
    }
  }

  //Get List
  export const getList = async (tableName,fieldName)=>{
    try{
      const result = await dbUrl.get(`/db/list/${tableName}/${fieldName}`)
      const data = await result.data
      return (data)
    }catch(error){
      // console.log(error)
    }
  }

  export const getConditionalList = async (tableName,fieldName,conditionalField, condition)=>{
    try{
      const result = await dbUrl.get(`/db/subList/${tableName}/${fieldName}/${conditionalField}/${condition}`)
      const data = await result.data
      return (data)
    }catch(error){
      // console.log(error)
    }
  }


//Get Record
export const getRecord = async (req, res)=>{
  const params = {
      tableName: req.tableName,
      recordId: req.recordId,
      idField: req.idField
  }

  try{
    const result = await dbUrl.post("/db/getRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}

//Get Records
export const getRecords = async (req, res)=>{
  
  const params = {
      tableName: req.tableName,
      conditionalField: req.conditionalField,
      condition: req.condition
  }

  try{
    const result = await dbUrl.post("/db/getRecords",{params})
    console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    console.log(error)
  }
}

//Look up a single value
export const getValue = async (tableName,lookupField, conditionalField,conditionalValue)=>{
  
  try{
    const result = await dbUrl.get(`/db/value/${tableName}/${lookupField}/${conditionalField}/${conditionalValue}`)
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Create New Record
export const addRecord = async (tableName, formData)=>{
    const params = {
        tableName: tableName,
        formData: formData
    }
    // console.log(params)
    try{
      const result = await dbUrl.post("/db/addRecord",{params})
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
}

//Create New User
export const addUser = async (formData)=>{
  
  const params = {
      tableName: "users",
      formData: formData
  }
 
  try{
    const result = await dbUrl.post("/db/addUser",{params})
    console.log(result.data)
    return (result.data)

  }catch(error){
    console.log(error)
  }
}


//Update Record
export const updateRecord = async (req, res)=>{
    
    const params = {
        tableName: req.tableName,
        idField: req.idField,
        recordId: req.recordId,
        formData: req.formData
    }

    //console.log(params)
    try{
      const result = await dbUrl.post("/db/updateRecord",{params})
      //console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      //console.log(error)
    }
}

//Delete Record
export const deleteRecord = async (req, res)=>{

  const params = {
      tableName: req.tableName,
      idField: req.idField,
      recordId: req.recordId
  }
  try{
    const result = await dbUrl.post("/db/deleteRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}


//Filter Data
export const runFilter = async(tableName, filterList)=>{
  const params={
    tableName: tableName,
    filterList: filterList
  }
  try{
    console.log(params)
    const result = await dbUrl.post("/db/filterTable",{params})
    // console.log(result)

    const {data,dataTypes} = await result.data
    return ({data,dataTypes})

  }catch(error){
    console.log(error)
    return error
  }
}


//Reset User Password
export const resetPassword = async (req)=>{

  const params = {
    tableName: req.tableName,
    idField: req.idField,
    recordId: req.recordId,
    formData: req.formData
  }

  try{
    const result = await dbUrl.post("/db/updateRecord",{params})
    //console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    //console.log(error)
  }
}

//Update Activity Log

export const updateActivityLog = async(app, recordId, userEmail, description)=>{
  
  const formData = {
    "app":app,
    "record_id":recordId,
    "user":userEmail,
    "description":description
  }
  
  const params = {
    tableName: "activities",
    formData:formData
  }
  
  try{
    const result = await dbUrl.post("/db/addRecord",{params})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}


//Send Email
export const sendEmail = async (req, res)=>{
    
  const params = {
      to: req.to,
      subject: req.subject,
      message: req.message,
      htmlPage: req.htmlPage
  }

  //console.log(params)
  try{
    const result = await dbUrl.post("/sendEmail",{params})
    // console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    // console.log(error)
  }
}

//Ask GPT
export const askGPT = async (req)=>{

  const params = {
    prompt: req
  }

  try{
    const result = await dbUrl.post("/gpt/ask",{params})
    return (result)
  }catch(error){
    // console.log(error)
  }
}

//Generate Image
export const generateImage = async (req)=>{

  const params = {
    prompt: req
  }

  try{
    const result = await dbUrl.post("/gpt/image",{params})
    console.log(result)
    return (result.data[0].url)
  }catch(error){
    // console.log(error)
  }
}

//Scan Document
export const scanInvoice = async ({args})=>{
  
  const {documentText, record} = args

  const prompt = `The following is an invoice received from a supplier: ${documentText}. Fill in the values in this javascript object: ${JSON.stringify(record)} based on the information in the invoice. Leave a value blank if it can not be determined based on the invoice document received. Return response as javascript object. Be sure to return a properly structured json object with closed brackets and array sub elements if needed.`
  // console.log(prompt)

  const params = {
    prompt: prompt
  }

  try{
    const result = await dbUrl.post("/gpt/ask",{params})
    console.log(JSON.parse(result.data))
    return (JSON.parse(result.data))
  }catch(error){
    // console.log(error)
  }
}

//Search database:
export const search = async (searchTerms) => {

  try {
    const response = await axios.post('/search', { searchTerms });
    console.log(response.data.result)
    return (response.data.result)
  } catch (error) {
    console.error('Error searching:', error);
  }
};

//Get list of all tables in database:
const query= `SELECT table_name FROM information_schema.tables where table_schema = 'public';`
