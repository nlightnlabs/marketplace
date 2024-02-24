import React, {useState, useEffect} from 'react'
import './index.css'


function App() {

  // Specifiy FreeAgent or nlightn environment
  const context = {clientAPI:null} //remove this if in FreeAgent
  const environment = "nlightn" // Change this to "Free Agent" if in Freeagent
  const [faClient, setFaClient] = React.useState(context.clientAPI)

  // Dynamically import bootstrap
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const useExternalScript = (src) => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);

    setTimeout(() => {
        initializeFreeAgentConnection();
    }, 500);

    return () => {
            document.body.removeChild(script);
        };
        }, [src]);
};
 //script to itnegrate FreeAgent library
 useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');

 const initializeFreeAgentConnection = () => {
  const FAAppletClient = window.FAAppletClient;
  
  //Initialize the connection to the FreeAgent this step takes away the loading spinner
  const faApplet = new FAAppletClient({
      appletId: 'Marketplace',
  });

  faApplet.listEntityValues()

}

  //Get all records from a Free Agent app
  const getFAAllRecords = async (appName)=>{
   
    try {
      let data=[];
      const response = await faClient.listEntityValues({
        entity: appName
      });

      response.map(async (record, index) => {
        let rowData = {};
        Object.entries(record.field_values).map(([key,value])=>{
          rowData = {...rowData,...{[key]:value.display_value}};
        })
        data.push(rowData);
      })

      console.log(data);
      return data;
      
    }catch(error){
      console.log(error);
      return [];
    }
  }


//Get filtered and sorted records from a Free Agent app
const getFARecords = async (appName="custom_app_35", limit=null, filters=null,order=null, offset=3, pattern=null)=>{
 
    try {
      let data=[];
      const response = await faClient.listEntityValues({
        entity: appName,
        limit: limit,
        filters:  filters, //[ { field_name : "first_name", operator : "equals", values : ["Steve"] } ]
        order: order, //[["first_name","ASC"],["seq_id","DESC"]]
        offset: offset,
        pattern: pattern
      });

     
      await Promise.all(response.map(async (record, index) => {
        let rowData = {};
        Object.entries(record.field_values).map(([key,value])=>{
          rowData = {...rowData,...{[key]:value.display_value}};
        })
        data.push(rowData);
      }));

      console.log(data);
      return data;
      
    }catch(error){
      console.log(error);
      return [];
    }
}


//Add a new record in a Free Agent app
const addFARecord = async (appName, formData)=>{

  //Only send fields where the formData maps the fields in the app
  let updatedFormData = {};
  try{
    const tableData = await getFARecords(appName);
    console.log(tableData);
    const fields = Object.keys(tableData[0]);
    console.log(fields);

    await Promise.all(response.map(async (record, index) => {
      Object.keys(formData).map(item=>{
        if(fields.includes(item)){
          updatedFormData = {...updatedFormData,...{[item]:formData[item]}};
        }
      })
    }));
    console.log(updatedFormData);
    
  }catch(error){
    console.log(error)
  }

    const response = await  faClient.createEntity({
      entity:appName,
      field_values: updatedFormData
    })
    console.log(response)
}

  //Update or delete a record in a Free Agent app app
  const updateFARecord = async (appName, recordId)=>{
      await faClient.updateEntity({
          entity:appName, // app name
          id: recordId, //What record to update
          field_values: {
              description: "",
              owner: "",
              deleted: false //ONLY USE IF need to delete
          }
      })
  }

  //Get an entire table from nlightn labs
  const getNlightnTable = async (tableName) => {
    const url = `https://nlightnlabs.net/db/getTable/${tableName}`;
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('Error adding record:', error);
      return { error: error.message }; // Handle errors gracefully
    }
  };

  //Update a record in nlightn labs
  const updateNlightnRecord = async (tableName, idField, recordId,formData) => {
    const url = `https://nlightnlabs.net/db/updateRecord`;
    
    const params = {
      tableName: tableName,
      idField: idField,
      recordId: recordId,
      formData: formData
  }
   
    try {
      const response = await fetch(url, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({params})
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.error('Error adding record:', error);
      return { error: error.message }; // Handle errors gracefully
    }
  };
  
  //Run a query on nlightn labs
  const runNlightnQuery = async (query) => {
    const url = `https://nlightnlabs.net/db/query`;
    // const url = `http://localhost:3001/db/query`;
   
    try {
      const response = await fetch(url, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({query})
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data =await response.json()
      console.log(data)
      return data; // parses JSON response into native JavaScript objects
    } catch (error) {
      console.error('Error adding record:', error);
      return { error: error.message }; // Handle errors gracefully
    }
  };
  
  const addNlightnRecord = async (tableName, formData) => {
    const url = "https://nlightnlabs.net/db/addRecord";

    let updatedFormData = {}
    try{
      const getFieldsFromDb = await fetch(`https://nlightnlabs.net/db/table/${tableName}`)
      const data = await getFieldsFromDb.json()
      console.log(data.data)
      const fields = Object.keys(data.data[0])
      console.log(fields)

      Object.keys(formData).map(item=>{
        if(fields.includes(item)){
          updatedFormData = {...updatedFormData,...{[item]:formData[item]}}
        }
      })
      console.log(updatedFormData)
    }catch(error){
      console.log(error)
    }

    const params = {
      tableName: tableName,
      formData: updatedFormData
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({params})
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.error('Error adding record:', error);
      return { error: error.message }; // Handle errors gracefully
    }
  };
  

  // Set up local states for this app
  const windowSize = React.useState({width: window.innerWidth, height: window.innerHeight});
  const [showCart, setShowCart] = React.useState(false)
  const [showOrderForm, setShowOrderForm] = React.useState(false)
  const [showItemPage, setShowItemPage] = React.useState(false)
  const [cart, setCart] = React.useState([])
  const [catalogItems, setCatalogItems] = React.useState([])
  const [items, setItems] = React.useState([])
  const [filterCriteria, setFilterCriteria] = React.useState([])
  const [cardDetails, setCardDetails] = React.useState([])
  const [currencySymbol, setCurrencySymbol] = React.useState("$")

  const [filteredItems, setFilteredItems] = React.useState([])

  const getUserData = async () => {

    if(environment =="Free Agent"){

      const user = await faClient.getUserInfo();
      setAppData(prevAppData => ({
        ...prevAppData,
        user: user
      }));

      const userData = await faClient.getTeamMembers({
        entity: 'agent',
        });
        setAppData(prevAppData => ({
          ...prevAppData,
          users: userData
        }));

        getIcons();
    }
    
    else{
      const response = await fetch("https://nlightnlabs.net/db/table/users");
      const json = await response.json();
      let userData = json.data;
      let user = userData.find(record => record.first_name === "General");
      let userSet = new Set();
      userData.map(item => {
        userSet.add(item.full_name);
      });
      
      let userList = Array.from(userSet).sort();
      let users = { data: userData, list: userList};

      setAppData(prevAppData => ({
        ...prevAppData,
        user: user,
        users: users
      }));

      getIcons();
    }
      
};

const getEmployeeData = async () => {

  if(environment =="Free Agent"){
    let data=[];
    try {
      const data = await getFAAllRecords("custom_app_35")
      
      let employeeSet = new Set()
      data.map(item=>{
        employeeSet.add(item.name)
      })
      let employeeList = Array.from(employeeSet)

      let employees = {data: data, list: employeeList.sort()}
      setAppData(prevAppData => ({
        ...prevAppData,
        employees: employees
      }));
      
    }catch(error){
      console.log(error)
    }
  }
  
  else{
    const response = await fetch("https://nlightnlabs.net/db/table/users");
    const json = await response.json();
    let employeeData = json.data;
    let employeeSet = new Set();
    employeeData.map(item => {
      employeeSet.add(item.full_name);
    });
    
    let employeeList = Array.from(employeeSet).sort();
    let employees = { data: employeeData, list: employeeList};

    setAppData(prevAppData => ({
      ...prevAppData,
      employees: employees
    }));

    getIcons();
  }
    
};

const setupFilters = async (data)=>{
  let items = data
  const createListFromTableData = (tableData, fieldName)=>{
    if(tableData.length>0 && fieldName !=null && fieldName !=""){
      let set = new Set()
      tableData.map(item=>{
        set.add(item[fieldName])
        })
      let list = Array.from(set)
      return list.sort()
    }
  }
  const filterData = [
    {id: 1, name: "category", label: "Category", reference_data_name:"category", operator:"===", value:"", data_type: "text", convertedValue: (value)=>{return value.toString();}, list: createListFromTableData(items, "category"), color:"rgb(0,0,0)", width:200},
    {id: 2, name: "subcategory", label: "Subcategory", reference_data_name:"subcategory", operator:"===", data_type: "text",value:"",convertedValue: (value)=>{return value.toString();}, list:createListFromTableData(items, "subcategory"), color:"rgb(0,0,0)", width:200},
    {id: 3, name: "supplier", label: "Supplier", reference_data_name:"supplier", operator:"===", data_type: "text",value:"", convertedValue: (value)=>{return value.toString();}, list:createListFromTableData(items, "supplier"), color:"rgb(0,0,0)", width:200},
    
    {id: 4, name: "min_price",label: "Min Price", reference_data_name:"price", operator:">=", data_type: "number",value:"", convertedValue: (value)=>{return Number(value);},list: null, filterList: null, color:"rgb(0,0,0)", width:100},
    {id: 5, name: "max_price", label: "Max Price", reference_data_name:"price", operator:"<=", data_type: "number",value:"",convertedValue: (value)=>{return Number(value);},  formlistList: null, filterList: null, color:"rgb(0,0,0)", width:100},
    {id: 6, name: "rating", label: "Min Rating", reference_data_name:"rating", operator:">=",data_type: "number", value:"",  convertedValue: (value)=>{return Number(value.toString().length);},list:createListFromTableData(items, "star_rating"),color:"rgb(255,200,0)", width:150},
    {id: 7, name: "quantity_in_stock", label: "Min Qty in Stock", reference_data_name:"quantity_in_stock", data_type: "number",value:"", convertedValue: (value)=>{return Number(value);}, operator:">=",  list:null, filterList:null,color:"rgb(0,0,0)", width:150},
    {id: 8, name: "lead_time", label: "Max Lead Time", reference_data_name:"lead_time", operator:"<=", data_type: "number",value:"", convertedValue: (value)=>{return Number(value);},list:null, filterList:null,color:"rgb(0,0,0)", width:150},
  ]
  setFilterCriteria(filterData)
  setAppData(prevAppData => ({
    ...prevAppData,
    filterCriteria: filterCriteria
  }));
}

const getIcons = async()=>{
  const response = await fetch("https://nlightnlabs.net/db/table/icons");
    const json = await response.json();
    let iconData = json.data;
    setAppData(prevAppData => ({
      ...prevAppData,
      icons: iconData
    }));
  };

const getCurrencies = async ()=>{
        let data=[];
        if(environment == "Free Agent"){
          try {
            const data = await getFAAllRecords("custom_app_10")
            
            setAppData(prevAppData => ({
              ...prevAppData,
              countries: data
            }));
          }catch(error){
            console.log(error)
          }
        }else{
          try{
            const response = await fetch(`https://nlightnlabs.net/db/table/currencies`)
            const json = await response.json(); 
            data = json.data
            setAppData(prevAppData => ({
              ...prevAppData,
              countries: data
            }));
          }
          catch(error){
            console.log(error)
          }
        }
}

const getBusinessUnits = async ()=>{
      let data=[];
      if(environment == "Free Agent"){
        try {
          const data = await getFAAllRecords("custom_app_44")
          let businessUnitsSet = new Set()
          data.map(item=>{
          businessUnitsSet.add(item.name)
          })
          let businessUnitsList = Array.from(businessUnitsSet)

          let businessUnits = {data: data, list: businessUnitsList.sort()}
          setAppData(prevAppData => ({
            ...prevAppData,
            businessUnits: businessUnits
          }));
          
        }catch(error){
          console.log(error)
        }
      }else{
        try{
          const response = await fetch(`https://nlightnlabs.net/db/table/business_units`)
          const json = await response.json(); 
          data = json.data

          let businessUnitsSet = new Set()
          data.map(item=>{
          businessUnitsSet.add(item.name)
          })
          let businessUnitsList = Array.from(businessUnitsSet)

          let businessUnits = {data: data, list: businessUnitsList.sort()}
          setAppData(prevAppData => ({
            ...prevAppData,
            businessUnits: businessUnits
          }));
        }
        catch(error){
          console.log(error)
        }
      }
  }
    
const getFacilities = async ()=>{
  let data=[];
  if(environment == "Free Agent"){
    try {
      const data = await getFAAllRecords("custom_app_51")

      let facilitiesSet = new Set()
        data.map(item=>{
          facilitiesSet.add(item.name)
        })
        let facilitiesList = Array.from(facilitiesSet)

        let facilities = {data: data, list: facilitiesList.sort()}
        setAppData(prevAppData => ({
          ...prevAppData,
          facilities: facilities
        }));

    }catch(error){
      console.log(error)
    }
  }else{
    try {
      const response = await fetch(`https://nlightnlabs.net/db/table/facilities`)
      const json = await response.json(); 
      data = json.data
      let facilitiesSet = new Set()
        data.map(item=>{
          facilitiesSet.add(item.name)
        })
        let facilitiesList = Array.from(facilitiesSet)

        let facilities = {data: data, list: facilitiesList.sort()}
        setAppData(prevAppData => ({
          ...prevAppData,
          facilities: facilities
        }));

    }catch(error){
      console.log(error)
    }
  }
}

const getCatalogItems = async ()=>{
  let data=[];
  if(environment == "Free Agent"){
    try {
      const data = await getFAAllRecords("custom_app_22")
      setCatalogItems(data)
      setAppData(prev=>({...prev,catalogItems:data}))

      let items = []
      data.map(item=>{
        items.push({...item,...{["quantity"]:""},...{["item_amount"]:""}})
      })
      console.log(data)
      setFilteredItems(data) 

      
      setAppData(prev=>({...prev,items:items}))
      setItems(items);  
      
      setupFilters(data)     
    }catch(error){
      console.log(error)
    }
  }else{

    try{
      const response = await fetch(`https://nlightnlabs.net/db/table/catalog_items`)
      const json = await response.json(); 
      data = json.data;
      setCatalogItems(data)
      setAppData(prev=>({...prev,catalogItems:data}))

      let items = []
      data.map(item=>{
        items.push({...item,...{["quantity"]:""},...{["item_amount"]:""}})
      })
      setFilteredItems(data)
      setAppData(prev=>({...prev,items:items}))
      setItems(items);
      setupFilters(data)
    }
    catch(error){
      console.log(error)
    }
  }

}

  const [appData, setAppData] = React.useState({
    environment,
    faClient,
    user:{},
    users:{},
    employees:{},
    icons:[],
    facilities:{},
    businessUnits:{},
    countries:{},
    filterCriteria:[],
    totalAmount:0,
    totalItems:0,
    appHomePage:"",
    cart:[],
    getCatalogItems,
    catalogItems:[],
    items:[],
  });


  ///Run function to get initial data
  React.useEffect(() => {
    getUserData();
    getEmployeeData();
    getCurrencies();
    getBusinessUnits();
    getFacilities();
    getCatalogItems();
  },[])

 
  // Define standard functions

  const toProperCase = (str)=>{
    return str.split(" ")
     .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
     .join(" ");
  }
  
  const UTCToLocalTime =(utcDateString)=>{
    const utcDate = new Date(utcDateString);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
    return localTime.toLocaleString(); // Adjust the output format as needed
  }
  
  const UTCToLocalDate =(utcDateString)=>{
    const utcDate = new Date(utcDateString);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
    return localTime.toLocaleString().slice(0,localTime.toLocaleString().search(","));
  }
  
  const formatDateInput = (inputValue)=>{
    let dateValue = new Date(inputValue);  
    let dd = String(dateValue.getDate()).padStart(2, '0'); 
    let mm = String(dateValue.getMonth() + 1).padStart(2, '0'); let yyyy = dateValue.getFullYear(); 
    let formattedDate = yyyy + '-' + mm + '-' + dd; 
    return formattedDate
  }

  const limitText =(textContent,maxLength)=>{
    if (textContent !="" && textContent !=null){
      var text = textContent.toString();
      if (text.length > maxLength) {
        text=text.substring(0, maxLength) + '...';
      }
      return(text)
    }
  }

   //Define Standard Styles
   const iconButtonStyle = {
    height: "30px",
    width: "30px",
    cursor: "pointer"
  }
  
  //Define Standard Components
  const FormInput = (props)=>{
    const id = props.id;
    const name = props.name;
    const label = props.label;
    const placeholder = props.placeholder;
    const [value, setValue] = React.useState(props.value);
    const handleParentChange = props.onChange

    const handleInputChange = (e)=>{
      setValue(e.target.value)
      handleParentChange(e)
    }

    return(
      <div className="form-floating mb-2">
        <input id={id} name={name} value={value} className="form-control" style={{color: "rgb(0,150,235)"}} placeholder={placeholder} onChange={(e)=>handleInputChange(e)}></input>
        <label htmlFor= {name} className="form-label">{label}</label>
      </div>
    );
  }

  const FormSelect = (props)=>{
    const id = props.id;
    const name = props.name;
    const label = props.label;
    const placeholder = props.placeholder;
    const [value, setValue] = React.useState(props.value);
    const list = props.list;
    const handleParentChange = props.onChange;

    const handleInputChange = (e)=>{
      setValue(e.target.value)
      handleParentChange(e)
    }


    return(
      <div className="form-floating mb-2">
        <select
        id={id} name={name} value={value} className="form-control" placeholder={placeholder} onChange={(e)=>handleInputChange(e)}
        style={{color: "rgb(0,150,235)"}}
        >
          {
            list.map((item, index)=>(
              <option key={index} value={item}>{item}</option>
            ))
          }
        </select>
        <label htmlFor= {name} className="form-label">{label}</label>
      </div>
    );
  }

  const FormTextArea = (props)=>{
    const id = props.id;
    const name = props.name;
    const label = props.label;
    const placeholder = props.placeholder;
    const [value, setValue] = React.useState(props.value);
    const handleParentChange = props.onChange;

    const handleInputChange = (e)=>{
      setValue(e.target.value)
      handleParentChange(e)
    }

    return(
      <div className="form-floating mb-2">
        <textarea 
        id={id} name={name} value={value} className="form-control" placeholder={placeholder} onChange={(e)=>handleInputChange(e)}
        style={{height: "100px", color: "rgb(0,150,235)"}}
        ></textarea>
        <label htmlFor= {name} className="form-label">{label}</label>
      </div>
    );
  }

  const MultiInput = (props) => {

    const appData = props.appData
    
    let target = {}
    const list = props.list || []
    const label = props.label
    const type = props.type
    const id = props.id
    const name =props.name
    const onChange= props.onChange 
    const onBlur= props.onBlur
    const onHover= props.onHover
    const [valueColor, setValueColor]= React.useState(props.valueColor)
    const [labelColor, setLabelColor]= React.useState(props.labelColor)
    const optionColor = props.optionColor
    const valueSize= props.valueSize 
    const labelSize= props.labelSize 
    const optionSize = props.optionSize
    const valueWeight=  props.valueWeight
    const labelWeight= props.labelWeight
    const optionWeight = props.optionWeight
    const layout= props.layout
    const border= props.border
    const valueFill= props.valueFill 
    const [labelFill, setLabelFill] = React.useState(props.labelFill)
    const padding= props.padding
    const rounded= props.rounded
    const readonly= props.readonly
    const disabled= props.disabled
    const required = props.required
    const showLookupValue = props.showLookupValue || false
    const width = props.width
    const height = props.height
    const dropDownFill = props.dropDownFill
    const allowAddData = props.allowAddData
    const marginTop = props.marginTop
    const marginBottom = props.marginBottom
  
    const [value, setValue] = React.useState("")
    const [options, setOptions] = React.useState([])
    const [dropDownDisplay, setDropDownDisplay] = React.useState("none")
    const [calendarDisplay, setCalendarDisplay] = React.useState("none")
    const [datePickerDisplay, setDatePickerDisplay] = React.useState("none")
    const [selectedIndex, setSelectedIndex] = React.useState(props.list ? props.list.indexOf(props.value) : 0)
  
    const [startDate, setStartDate] = React.useState(new Date());
  
    const [formClassList, setFormClassList] = React.useState("form-floating w-100")
  
    const inputRef = React.useRef("")
    const containerRef = React.useRef("")
  
    React.useEffect(()=>{
      if(props.list && options.length<1){
        setOptions(props.list.filter(item=>item))
      }
  
      if(props.readonly || props.disabled){
        setValueColor("black")
        setLabelFill("white")
       }else{
        setValueColor(props.valueColor)
       }
  
       if(props.label && props.label !==""){
        setFormClassList("form-floating w-100")
       }else{
        setFormClassList("form-group w-100")
       }
  
    },[props.list, props.readonly, props.disabled, props.label])
  
    React.useEffect(()=>{
      setValue(props.value || "")
    },[props.value])
  
  
    const containerstyle={
      display: "flex",
      position: "relative",
      top: 0,
      left: 0,
      get display(){if(layout=="stacked"){return "block"}else{return "flex"}},
      width: "100%",
      minHeight: height,
      marginTop: marginTop || 0,
      marginBottom: marginTop || 10
    }
    
  
    const inputStyle ={
      cursor: "pointer",
      fontSize: valueSize || 14,
      fontWeight: valueWeight || "normal",
      color: valueColor || "#5B9BD5",
      backgroundColor: valueFill || "white",
      outline: "none",
      width: width || "100%",
      border: border|| "1px solid rgb(235,235,235)",
      get padding(){ if(padding){return padding}else{ return ;}}
    }
  
    const textAreaStyle ={
      cursor: "pointer",
      fontSize: valueSize || 14,
      fontWeight: valueWeight || "normal",
      color: valueColor || "#5B9BD5",
      backgroundColor: valueFill || "white",
      outline: "none",
      width: width || "100%",
      minHeight: 100,
      border: border|| "1px solid rgb(235,235,235)",
    }
  
    const labelStyle ={
      fontSize: labelSize || inputStyle.fontSize,
      fontWeight: labelWeight || "normal",
      color: labelColor || "rgb(145, 145, 145)",
      backgroundColor: "rgba(145, 145, 145,0)",
      background: "rgba(145, 145, 145,0)"
    }
  
    const[containerHeight, setContainerHeight] = React.useState(0)
    React.useEffect(()=>{
      if(containerRef.current.clientHeight>0){
        setContainerHeight(Number(containerRef.current.clientHeight))
      }
    },[containerRef])

    const dropDownStyle = {
      display: dropDownDisplay,
      position: "absolute",
      top: Number(containerstyle.top) + containerHeight,
      left: inputStyle.left,
      width: "100%",
      maxHeight: 300,
      overflowY: "auto",
      overflowX: "hidden",
      padding: padding || 5,
      backgroundColor: dropDownFill || "rgba(255,255,255,0.95)",
      boxShadow: "5px 5px 5px lightgray",
      border: "1px solid lightgray",
      borderRadius: "0px 0px 5px 10px",
      color: valueColor || "#5B9BD5",
      zIndex: 999999
    }

    
  
    const optionsStyle = {
      display: "block",
      width: "100%",
      cursor: "pointer",
      fontSize: inputStyle.fontSize,
      fontWeight: optionWeight || "normal",
      padding: padding || 5,
      color: optionColor || "black",
      backgroundColor: "white" || "rgb(255,255,255,0)",
    }
  
  
    const handleOptionClick=(e)=>{
  
      let selectedIndex = e.target.id
      let selectedValue = props.list[selectedIndex]
  
      setValue(selectedValue)
      setSelectedIndex(selectedIndex)
      setOptions(props.list)
  
      setDropDownDisplay("none")
      updateStates(e,selectedValue)
    }
  
    const handleOptionHover = (event)=>{
      if(event.type == "mouseover") {
        event.target.style.backgroundColor = "rgb(235,245,255)";
        event.target.style.fontWeight = "bold";
        event.target.style.color = "#2C7BFF";
      }else{
        event.target.style.backgroundColor = optionsStyle.backgroundColor;
        event.target.style.fontWeight = optionsStyle.fontWeight;
        event.target.style.color = optionsStyle.color;
      }
    }
  
    const handleDropDownToggle=(event)=>{
        setDropDownDisplay("block")
    }
  
    const updateStates=(e,inputValue)=>{
  
      let selectedValue = inputValue
      let selectedIndex = 0
      if(props.list && props.list.length>0){
        selectedIndex = props.list.indexOf(selectedValue) || 0
      }
      setSelectedIndex(selectedIndex)
      updateParent(e,selectedValue)
    }
  
    const updateParent = (e,inputValue)=>{
      if(typeof onChange =="function"){
        let target = {
          ...props,
          value: inputValue,
          eventType: e.type
        }
        onChange({target})
      }
    }
    
    const handleHover=(e)=>{
      if(e.type =="mouseleave"){
          setDropDownDisplay("none")
      }
    
    }
  
    const handleDoubleClick = ()=>{
      props.list && props.list>0 && setOptions(props.list)
    }
  
    const handleFocus = (element)=>{
      props.list && props.list>0 && setOptions(props.list)
      setDropDownDisplay("block")
    }
  
    const handleBlur=(e)=>{
      if (typeof onBlur =="function"){
        let target = {
          ...props,
          value: value,
          eventType: e.type
        }
        onBlur({target})
      }
    }

    const formatDateInput = (inputValue)=>{
      let dateValue = new Date(inputValue);  
      let dd = String(dateValue.getDate()).padStart(2, '0'); 
      let mm = String(dateValue.getMonth() + 1).padStart(2, '0'); let yyyy = dateValue.getFullYear(); 
      let formattedDate = yyyy + '-' + mm + '-' + dd; 
      return formattedDate
    }
  
    const inputProps = {
      readOnly: readonly || false,
      disabled: disabled || false,
      required: required || false,
      multiple: true 
    }
  
    const handleInputChange=(e)=>{
        let inputText = e.target.value
        setValue(inputText)
        
        if(props.list && props.list.length>0){
          // filter the options based on the text user has inputted
          if(inputText && inputText.length>=1){
            setOptions(options.filter(item=>item.toLowerCase().includes((inputText).toLowerCase())))
          }else{
            setOptions(list.filter(item=>item))
          }
        }
        updateStates(e,inputText)
    }
  
    const addIconStyle = {
      maxHeight: 20,
      maxWidth: 20,
      cursor: "pointer"
    }
  
    const handleAddData = ()=>{
  
    }
  
    const formatDate = (inputValue)=>{
      var date = new Date(inputValue); 
      var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )) .toISOString() .split("T")[0];
      setValue(dateString || "")
    }
  
    const formatValue = (inputValue)=>{
      if(type == "date"){
        formatDate(inputValue)
      }else{
        setValue(inputValue || "")
      }
    }
  
    const pageStyle = `
      input:disabled {
        background: #dddddd;
      }
      
      input:disabled+label {
        color: red;
      }
  
    `

    return (
      <div 
        ref = {containerRef}
        id={id}
        name={name} 
        className="d-flex flex-column"
        style={containerstyle}
        onBlur={(e)=>handleBlur(e)}
        onMouseLeave={(e)=>handleHover(e)}
        onClick={(e)=>handleDropDownToggle(e)}
      >
            <div className={formClassList}>
            {type == "textarea" ?
                <textarea 
                  className="form-control"
                  id={id}
                  name={name}
                  style={textAreaStyle} 
                  ref = {inputRef}
                  type={type}
                  value={value}
                  onChange={(e)=>handleInputChange(e)}
                  onBlur={(e)=>handleBlur(e)}
                  {...inputProps}
                  >
              </textarea>
              :
              type == "file" ?
                <input 
                  className="form-control"
                  id={id}
                  name={name}
                  style={textAreaStyle}
                  ref = {inputRef}
                  type={type}
                  value={value}
                  placeholder={label}
                  onChange={(e)=>handleInputChange(e)}
                  onBlur={(e)=>handleBlur(e)}
                  {...inputProps}
                  >
              </input>
              :
              <input 
                  className="form-control"
                  id={id}
                  name={name}
                  style={inputStyle}
                  ref = {inputRef}
                  type={type}
                  placeholder={label}
                  value={type=="date"? formatDateInput(value):value}
                  onChange={(e)=>handleInputChange(e)}
                  onBlur={(e)=>handleBlur(e)}
                  onDoubleClick={(e)=>handleDoubleClick(e)}
                  onFocus={(e)=>handleFocus(e)}
                  {...inputProps}
                  >
              </input>
              }
              {label && label!=="" && <label htmlFor={name} className="form-label text-body-tertiary small" style={labelStyle}>{label}</label>}
            </div>
          
  
           {props.list && props.list.length>0 && type!=="date" &&
              <div style={dropDownStyle}>
                {options.map((item,index)=>(
                  <div
                    key={index}
                    id={props.list.indexOf(item)}
                    name={item}
                    style={optionsStyle}
                    onClick={(e)=>handleOptionClick(e)}
                    onMouseOver={(e)=>handleOptionHover(e)}
                    onMouseLeave={(e)=>handleOptionHover(e)}
                  >
                    {item}
                  </div>
                ))}
              </div>  
          }
     
  
          <style>{pageStyle}</style>
      </div>
    )
  }

  const addToCart = (item)=>{

    let updatedCart = cart
    if(item.quantity =="" || item.quantity ==null){
      alert("Please enter a quantity")
      return
    }
    if(updatedCart.find(i=>i.id===item.id) !=null){
       updatedCart.find(i=>i.id===item.id).quantity = item.quantity
    }else{
      updatedCart = [...cart, item ]
      setCart(updatedCart);
    }

    let totalItems = updatedCart.length
    let total = Number(appData.totalAmount)
    updatedCart.map(item=>{
        let itemAmount = Number((Number(item.price)*Number(item.quantity)).toFixed(2))
        total = itemAmount + total
      })
     setAppData(prev=>({...prev,totalAmount: total, totalItems: totalItems, cart: updatedCart}))
 }

 const resetCart = ()=>{
  setCart([])
  setFilterCriteria([])
  getCatalogItems()
 }

  const ItemPage = (props)=>{
    
    const appData = props.appData
    const item = props.item
    const components = props.components
    const toProperCase = components.toProperCase

    const tableStyle={
      fontSize: "12px",
      padding: "2px"
    }

    const cellStyle={
      padding: "2px"
    }

    const headerStyle={
      fontWeight: "bold",
      padding: "2px",
    }

    return(
      <div className="flex-container flex-column" style={{width:"100%"}}>
        {
          Object.entries(item).map(([key,value])=>(
              value !=null && value !="" && 
                <div key={key} className="row">
                  <div className="col-3 p-1" style={{color: "gray"}}>{toProperCase(key.replaceAll("_"," "))}: </div>
                  <div className="col-9 p-1">
                    {
                      Array.isArray(value)?
                      <table className="table table-striped">
                          <thead>
                            <tr>
                              {Object.keys(value).map((col,colIndex)=>(
                                <th key={colIndex} scope="col" style={headerStyle}>{col}</th>
                              ))}
                            </tr>
                      </thead>
                        <tbody>
                          {value.map((row,rowIndex)=>(
                            <tr>
                              {Object.values(row).map((value,valIndex)=>(
                                <td key={valIndex} style="cellStyle">{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>          
                    :
                    typeof value =="object"?
      
                        <div>{JSON.stringify(value)}</div>
                    :
                    typeof value =="string" 
                    && (value.toLowerCase().includes(".png")||value.includes(".bmp")||value.includes(".jpg")||value.includes(".jpeg") ||value.includes(".gif"))
                    && (value.toLowerCase().includes("http"))?
                        <img src={value} style={{maxWidth: "80%", height:"auto"}} alt=""></img>
                    : 
                    typeof value =="string"?
                        <div>{value.toString()}</div>
                    :
                    null
                    }
                  </div>
                </div>
          )
        )}
      </div>
    )
  }

  const FloatingPanel = (props) => {
    const { children, title, height, width, top, left, appData, components, displayPanel } = props;
    const icons = appData.icons
    const toProperCase = components.toProperCase
    const iconButtonStyle = components.iconButtonStyle

    const panelRef = React.useRef();
    const allowDrag = true

    const [position, setPosition] = React.useState({ x: 0.5*window.innerWidth, y: 0.5*window.innerHeight });
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  
    const containerStyle = {
      position: "fixed",
      height: height,
      width: width,
      transform: "translate(-50%, -50%)",
      cursor: "move",
      zIndex: 9999,
    };
  
    const handleMouseDown = (e) => {
      if (!allowDrag) return;
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseUp = (e) => {
        setIsDragging(false)
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging || !allowDrag) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    };
  
    return (
      <div
        ref={panelRef}
        className="d-flex flex-column bg-light shadow border border-3 rounded-3"
        style={{
          ...containerStyle,
          left: position.x + "px",
          top: position.y + "px"
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleMouseUp}
      >
        <div className="d-flex justify-content-between align-items-center" style={{backgroundColor:"rgb(0,100,255)", height:"30px", overflow:"hidden"}}>
          <div className="d-flex" style={{fontSize:"16px", color: "white"}}>{toProperCase(title)}</div>
          <div className="d-flex" style={{fontSize:"16px"}} >
            <img src={icons.length>0 && icons.find(i=>i.name==="close").url} style={iconButtonStyle} onClick={(e)=>displayPanel(false)}/>
          </div>
        </div>

        {children}
      </div>
    );
  };


  const components = {
    MultiInput: <FormInput />, 
    FloatingPanel: <FloatingPanel />,
    ItemPage: <ItemPage/>,
    addToCart,
    toProperCase,
    UTCToLocalTime,
    UTCToLocalDate,
    formatDateInput,
    limitText,
    iconButtonStyle: iconButtonStyle,
  }


  const CatalogItem = (props)=>{

    let item = props.item
    const appData = props.appData;
    const setAppData = props.setAppData;
    
    const components = props.components
    const FloatingPanel = components.FloatingPanel
    const ItemPage = components.ItemPage

    const countries = appData.countries
    const icons = appData.icons
    const appHomePage = appData.appHomePage
    const faClient = appData.faClient

    const [showItemPage, setShowItemPage] = React.useState(false)
    const [quantity, setQuantity] = React.useState(item.quantity)
    const addToCart = components.addToCart

    const limitText = components.limitText

    const [itemAmount, setItemAmount] = React.useState(0)
    
    const handleInputChange = (e)=>{
      const {value} = e.target;
      setQuantity(value);
      item.quantity = Number(value)
      item.item_amount = Number((item.price * value).toFixed(2))
      setItemAmount(item.item_amount)
    }

    const handleAddToCart = ()=>{
      addToCart(item)
    }

    const handleItemClick = (item)=>{
      if(faClient !=null && faClient !=""){
        faClient.navigateTo(appHomePage)
      }else{
        setShowItemPage(true)
      }
    }

 
     const cardDetails=[
          {order: 1, name:"image", type:"image", value: item.image, label:"", color:"rgb(0,0,0)", fontSize:"18px", fontWeight: "bold", section:"header"},
          {order: 2, name:"item_name", type:"text", value: item.item_name, label:"", color:"rgb(0,0,0)", fontSize:"18px",fontWeight: "bold", section:"header"},
          {order: 3, name:"supplier", type:"text", value: item.supplier, label:"", color:"rgb(0,150,200)", fontSize:"16px", fontWeight: "normal", section:"header"},
          {order: 4, name:"price", type:"text", value: `${countries.length>0 && countries.find(r=>r.currency_name===item.currency).currency_symbol}${Number(item.price).toLocaleString()}`, label:`/${item.unit_of_measure}`, color:"rgb(0,0,0)", fontSize:"14px",fontWeight: "bold", section:"body"},
          {order: 5, name:"savings_persent", type:"text", value: `${(item.savings_percent*100).toFixed(1)}%`, label:"negotiated savings", color:"rgb(0,200,0)", fontSize:"14px", fontWeight: "bold", section:"body"},
          {order: 6, name:"star_rating", type:"text", value: item.star_rating, label:"community rating", color:"rgb(255,200,0)", fontSize:"14px", section:"body"},
          {order: 7, name:"quantity_in_stock", type:"text", value: item.quantity_in_stock, label:"in stock", color:"rgb(0,0,0)", fontSize:"14px", section:"body"},
          {order: 8, name:"lead_time", type:"text", value: item.lead_time, label:"estimated lead time", color:"rgb(0,0,0)", fontSize:"14px", section:"body"},
      ]
        

    const itemContainerStyle = {
      width: "300px",
      cursor: "pointer",
      maxHeight:"400px"
    }

    const itemImageStyle = {
      maxHeight: "75px",
      maxWidth: "100%"
    }

    const subLabelStyle = {
      color: "gray", 
      fontSize: "12px"
    }

    const iconButtonStyle = {
      height: "30px",
      width: "30px",
      cursor: "pointer"
  }

      return(
      
        <div className="d-flex flex-column border border-1 p-1 bg-white shadow-sm rounded-3 m-1" style={itemContainerStyle}>
          <div 
            className="d-flex align-items-center justify-content-between p-2"
            style={{borderBottom: "1px solid lightgray"}}
            >
            <div className="d-flex align-items-center w-75">
              <div className="d-flex me-2">Quantity: </div>
              <input id="quantity" name="quantity" className="form-control" value={quantity} onChange={(e)=>handleInputChange(e)}></input>
            </div>

            {appData.icons.length>0 && 
              <div className="d-flex align-items-center w-25 justify-content-end">
                  <img 
                    src={icons.find(i=>i.name==="add").url} 
                    style={iconButtonStyle} 
                    onClick={(e)=>handleAddToCart(e)}
                    title="Add to cart"
                    alt="Add icon"
                  >
                  </img>
              </div>
            }
          </div>
          <div className="d-flex w-100 flex-column p-1"  onClick={(e)=>handleItemClick(e)}>
            {cardDetails.map((obj,index)=>(
              obj.type==="image"?
                <div key={index} className="d-flex w-100">
                  <img src={obj.value} style={itemImageStyle}></img>
                </div>
              :
                <div key={index} >
                  <span style={{color: obj.color, fontSize: obj.fontSize, fontWeight: obj.fontWeight, padding:"2px"}}>{limitText(obj.value,50)}</span>
                  <span style={subLabelStyle}> {limitText(obj.label,50)}</span>
                </div>
            ))}
          </div>

          {showItemPage && 
            React.cloneElement(
              FloatingPanel,
              { ...{title: item.item_name, top:"50vh", left:"50vh", height:"80%", width:"50%", item: item, appData: appData, components: components, displayPanel: setShowItemPage } },
                <div className="d-flex bg-white p-3" style={{height:"95%", overflowY:"auto"}}>
                  {React.cloneElement(ItemPage, { item: item, appData: appData, components: components })}
                </div>
            )
          }
        </div>
      )
  }

  const Filter = (props)=>{
    
    const appData = props.appData;
    const icons = appData.icons
    const components = props.components
    const iconButtonStyle = components.iconButtonStyle

    const handleUpdateFilter = (e) => {
      const { name, value } = e.target;
      
      let updatedCriteria = filterCriteria
      updatedCriteria.find(item=>item.name===name).value = value
      setFilterCriteria(updatedCriteria);
    
      if(e.target.list ==null){
        console.log(value)
        setTimeout(()=>{
          applyFilter()
        },[1000])
      }else{
        console.log(updatedCriteria)
          applyFilter()
      }
      
    }
      
      const applyFilter = ()=>{
        
        let filtered = []
        let filterList = []
        console.log(filterCriteria)
        
        const allValuesAreEmptyOrNull = filterCriteria.every(obj => obj.value === "" || obj.value === null);
        if(allValuesAreEmptyOrNull){
          filtered = items
          setFilteredItems(items)
          return
        }
        
        items.map(item=>{
          let filterString ="";
          filterCriteria.map((filterItem,filterIndex)=>{
            const filterValue = filterItem.convertedValue(filterItem.value);
            const dataType = filterItem.data_type;
            if(filterValue !="" && filterValue !=null){
              let quotes = '"'
              if(dataType==="number"){
                quotes = ''
              }
              if(filterIndex!=0 && filterString.length>0){
                filterString = `${filterString} && ${quotes}${(item[filterItem.reference_data_name])}${quotes} ${filterItem.operator} ${quotes}${filterValue}${quotes}`
              }else{
                filterString = `${quotes}${item[filterItem.reference_data_name]}${quotes} ${filterItem.operator} ${quotes}${filterValue}${quotes}`
              }
            }
          })
          let includeItem = eval(filterString)
          if(includeItem){
              filtered = [...filtered,item]
          }  
        })
        setFilteredItems(filtered)
      }

      const clearFilter = (e)=>{
        setFilteredItems(items)
        let filters = filterCriteria
        filterCriteria.forEach((item,index)=>{
          filters[index].value = ""
        })
        setFilterCriteria(filters)
      }
    
    const FilterStyle ={
      fontSize: "12px"
    }

  
    return(
      <div
        className="d-flex bg-light p-1 w-100 flex-column align-items-center "
        style={FilterStyle}
      >
        <div className="d-flex justify-content-start flex-wrap align-items-center">

          <div className="d-flex align-items-center justify-content-around" style={{width:"75px"}}>
       
              {icons.length>0 && 
                <img 
                name="apply_filter" 
                src={icons.find(item=>item.name==="filter").url} 
                style={iconButtonStyle} 
                onClick={(e)=>applyFilter(e)} 
                title="Apply filter"
                alt="Filter icon" 
                />}


                {icons.length>0 && 
                <img name="reset_filter" 
                src={icons.find(item=>item.name==="reset").url} 
                style={iconButtonStyle} 
                onClick={(e)=>clearFilter(e)} 
                title="Reset filter"
                alt="Reset filter icon" 
                />}
          </div>
          <div className="d-flex flex-wrap align-items-center">
            
            {filterCriteria.map((item, index)=>(
            <div key={index} className="d-flex ms-1 me-1" style={{width: item.width}}>
              <MultiInput
                id={item.name}
                name={item.name}
                label={item.label}
                className="form-control" 
                placeholder={item.label}
                list={item.list}
                appData = {appData}
                value={filterCriteria.length>0 && item.value}
                valueColor = {item.color}
                optionColor = {item.color}
                onChange={(e)=>handleUpdateFilter(e)}
                />
            </div>))
            }
          </div>
          

        </div>
      </div>
    )
  }

  const Cart = (props)=>{

    const cart = props.cart
    const appData = props.appData
    const setAppData = props.setAppData

    const [totalAmount, setTotalAmount] = React.useState(appData.totalAmount)
    const [totalItems, setTotalItems] = React.useState(appData.totalItems)

    const icons = appData.icons

    const setCart = props.setCart
    const setShowOrderForm = props.setShowOrderForm

    const getTotals =(updatedCart)=>{
      let total = Number(totalAmount)
      updatedCart.map(item=>{
        let itemAmount = Number((Number(item.price)*Number(item.quantity)).toFixed(2))
        total = itemAmount + total
      })
      setTotalItems(updatedCart.length)
      setTotalAmount(total)
      setAppData({...appData,...{["totalItems"]:updatedCart.length}})
      setAppData({...appData,...{["totalAmount"]:total}})
    }


    const handleRemoveItem = (item)=>{
      console.log(item)
        let updatedCart = cart.filter(record => record.id !== item.id);
        setCart(updatedCart)
        getTotals(updatedCart)
    }

    const handleCheckout = (e)=>{
      setShowOrderForm(true)
    }

    const cellStyle={
      fontSize: "12px"
    }


    return(
      <div className="d-flex flex-column bg-light p-3" style={{width: "100%", height:"100%"}}>
        
        <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <div className = "d-flex" style={{fontWeight: "normal"}}>
            <span style={{marginRight: 5}}>Total Items:</span> 
            <span style={{fontWeight: "bold"}}> {Number(totalItems).toLocaleString()}</span> 
          </div>
          <div className = "d-flex" style={{fontWeight: "normal"}}>
            <span style={{marginRight: 5}}>Total Amount: </span>
            <span style={{fontWeight: "bold"}}> {currencySymbol}{Number(totalAmount.toFixed(2)).toLocaleString()}</span></div>
          </div>

          <div className="d-flex">
            {icons.length>0 && 
            <img name="reset_cart_icon" 
            title="Reset cart" alt="Reset Cart Icon" 
            src={`${icons.find(item=>item.name==="reset").url}`} 
            style={iconButtonStyle}
            onClick={(e)=>resetCart()}
            >
          </img>}
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={(e)=>handleCheckout(e)}>Check Out</button>
        <div>
          <table className="table table-striped" style={{fontSize: "12px"}}>
            <thead>
            <tr>
              <th scope="col" className="w-50">Item</th>
              <th scope="col" className="text-center">Quantity</th>
              <th scope="col" className="text-center">Price</th>
              <th scope="col" className="text-center" >Amount</th>
              <th scope="col" className="text-center"></th>
            </tr>
            </thead>
            <tbody>
            {cart.map((item)=>(
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td className="text-center">{Number(item.quantity).toLocaleString()}</td>
                <td className="text-center">{currencySymbol}{Number(item.price).toLocaleString()}</td>
                <td className="text-end">{currencySymbol}{Number(item.item_amount).toLocaleString()}</td>
                <td>
                  {icons.length>0 &&
                    <img 
                      src={icons.length>0 && icons.find(i=>i.name==="remove").url} 
                      style={iconButtonStyle}
                      onClick={()=>handleRemoveItem(item)} 
                    ></img>
                  }
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    )
  }

  const OrderForm = (props)=>{

    const appData = props.appData
    const setAppData = props.appData
    const components = props.components

    const UTCToLocalDate = components.UTCToLocalDate

    const cart = props.cart
    const businessUnits = appData.businessUnits
    const user = appData.user
    const users = appData.users
    const employees = appData.employees
    const facilities = appData.facilities
    const totalAmount = appData.totalAmount
    const totalItems = appData.totalItems

    const [formElements, setFormElements] = useState([
      {id: "order_name", name:"order_name", label: "Provide a subjec or name for the order", placeholder:"Provide a subject or name for the order", type:"input", value: `Purchase Order for ${user.business_unit} on ${UTCToLocalDate(new Date())}`, list: null},
      {id: "business_consumer", name:"business_consumer", label: "Primary business consumer for this order", placeholder:"Primary business consumer for this order", type:"input", value: users.list[0], list: users.list},
      {id: "business_unit", name:"business_unit", label: "Primary business unit for this order", placeholder:"Primary business unit for this order", type:"input", value: businessUnits.list[0], list: businessUnits.list},
      {id: "ship_to_location", name:"ship_to_location", label: "Ship to location", placeholder:"Ship to location",type:"input", value: facilities.list[0],  list: facilities.list},
      {id: "ship_to_address", name:"ship_to_address", label: "Ship to address", placeholder:"Ship to address",type:"input", value: facilities.data[0].address, list: null},
      {id: "need_by", name:"need_by", label: "Need By", placeholder:"Need By",type:"date", value: UTCToLocalDate(new Date()), list: null},
      {id: "notes", name:"notes", label: "Provide any additional notes", placeholder:"Provide any additional notes",type:"textarea", value: "", list: null}
    ])

    const [formData, setFormData] = useState({})
    useEffect(()=>{
      {formElements.map((formItem,index) => (
        setFormData(prev=>({...prev,[formItem.name]:formItem.value}))
      ))}
    },[formElements])

    const formatDateInput = (inputValue)=>{
      let dateValue = new Date(inputValue);  
      let dd = String(dateValue.getDate()).padStart(2, '0'); 
      let mm = String(dateValue.getMonth() + 1).padStart(2, '0'); let yyyy = dateValue.getFullYear(); 
      let formattedDate = yyyy + '-' + mm + '-' + dd;
      return formattedDate
    }

    const handleFormChange =(e)=>{
      const{name,value} = e.target
      setFormData(prev=>({...prev,...{[name]:value}}))
    }

    const handleSubmit = async ()=>{
      console.log(formData)

      const allValuesAreEmptyOrNull = Object.values(formData).every(obj => obj === "" || obj === null);
      if(allValuesAreEmptyOrNull){
        alert("Form as not been completed.  Please provide sufficient information")
        return
      }

      let finalFormData = {
        ...formData,
        ...{["total_amount"]:totalAmount},
        ...{["number_of_items"]:totalItems},
        ...{["items"]:cart}
      }


      if(environment == "Free Agent"){

        const orderForm = {
          subject: finalFormData.order_name,
          total_amount: finalFormData.total_amount,
          number_of_items: finalFormData.number_of_items,
          business_consumer: employees.data.find(record=>record.name_1===finalFormData.business_consumer).seq_id, 
          business_units: businessUnits.data.find(record=>record.name===finalFormData.business_unit).seq_id, 
          ship_to_location: facilities.data.find(record=>record.name===finalFormData.ship_to_location).seq_id, 
          need_by: formatDateInput(finalFormData.need_by),
          notes: finalFormData.notes
        }
        console.log(orderForm)

        //Function 1
        await addFARecord("custom_app_15",orderForm)

        //Function 2
        const newRecord = await faClient.listEntityValues({
          entity:'custom_app_15',
          limit: 1,
          order: [['seq_id','DESC']]
        })

        //Function 3
        const orderId = await newRecord[0].seq_id
        console.log(orderId)

        //Create order items
        await Promise.all(cart.map(async (record) => {
          await faClient.createEntity({
            entity: "custom_app_15_catalog_items",
            field_values: {parent_id:orderId,...orderForm}
          });
        }));

        alert(`Order has been created and is being reviewed: ${JSON.stringify(finalFormData)}`)
        setCart([])
        setShowOrderForm(false)
      }else{

        const orderForm = {
          order_name: finalFormData.order_name,
          total_amount: finalFormData.total_amount,
          number_of_items: finalFormData.number_of_items,
          order_date: UTCToLocalDate((new Date()).toString()),
          business_consumer: finalFormData.business_consumer, 
          user_id: users.data.find(record=>record.full_name===finalFormData.business_consumer).id, 
          business_unit: finalFormData.business_unit,
          ship_to_location: finalFormData.ship_to_location, 
          ship_to_address: facilities.data.find(record=>record.name===finalFormData.ship_to_location).address, 
          need_by: formatDateInput(finalFormData.need_by),
          notes: finalFormData.notes,
          items: (JSON.stringify(finalFormData.items)).toString()
        }
        console.log(orderForm)

        //Function 1
        await addNlightnRecord("orders",orderForm)

        //Function 2
        const query = `SELECT * FROM orders ORDER BY "id" DESC limit 1;`
        const newRecord = await runNlightnQuery(query)
        console.log(newRecord)

        //Function 3
        const orderId = await newRecord[0].id
        console.log(orderId)

        //Function 4
        await Promise.all(cart.map(async (record) => {
          let orderItem = {...record, ...{ ["order_id"]: orderId, ...orderForm } }
          console.log(orderItem)
          await addNlightnRecord("order_items",orderItem)
        }));
        
        alert(`Order has been created and is being reviewed`)
        setCart([])
        setShowOrderForm(false)
      }
    }

    return(
      <div className="d-flex flex-column bg-light p-3">
        <h3>Review Order</h3>
        
        <div className="d-flex justify-content-between">
          
          <div className="d-flex flex-column w-50 p-3">
          {formElements.map((formItem,index) => (
            <MultiInput 
              key={index} 
              id={formItem.id}
              name={formItem.name}
              label={formItem.label}
              value={formItem.value}
              type={formItem.type}
              list={formItem.list}
              placeholder={formItem.placeholder}
              onChange={(e)=>handleFormChange(e)} 
            />
          ))}
          </div>
         
        <div className="d-flex flex-column w-50 p-3">
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-primary" onClick={(e)=>handleSubmit(e)}>Submit</button>
          </div>
        <div className="d-flex flex-column">
              <div className="d-flex flex-column mb-2">
                <div className = "d-flex" style={{fontWeight: "normal"}}><span>Total Items:</span> <span style={{fontWeight: "bold"}}> {totalItems.toLocaleString('en-US')}</span> </div>
                <div className = "d-flex" style={{fontWeight: "normal"}}>Total Amount:  <span style={{fontWeight: "bold"}}> ${totalAmount.toFixed(2).toLocaleString('en-US')}</span></div>
              </div>
            <table className="table table-striped" style={{fontSize: "12px"}}>
              <thead>
              <tr>
                <th scope="col" className="">Item</th>
                <th scope="col" className="text-center">Quantity</th>
                <th scope="col" className="text-center">Price</th>
                <th scope="col" className="text-center">Amount</th>
              </tr>
              </thead>
              <tbody>
              {cart.map((item)=>(
                <tr key={item.id}>
                  <td className="text-left">{item.item_name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">${item.price}</td>
                  <td className="text-center">${item.item_amount}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    )
  }


  return(
    <div className="flex-container" style={{height:"95%", width:"100%", overflowY:"hidden"}}>

        {/* Filter */}
        {<div className="d-flex shadow-sm w-100">
          <Filter 
            appData = {appData}
            setAppData = {setAppData}
            components = {components}
          />
        </div>
        }

        <div  className="d-flex justify-content-center p-1" style={{height:"95%", width:"100%", overflowY:"hidden"}}>
              
              {/* Catalog Items */}
              <div className="d-flex justify-content-center" style={{height:"95%", overflowY:"auto"}}>

              
                  <div className="d-flex flex-column">
                    {filteredItems.length>0 &&  <div className="d-flex justify-content-center">{`${filteredItems.length} Item${filteredItems.length>1?"s":""}`}</div>}
                    <div className="d-flex justify-content-center flex-wrap">
                    {filteredItems.length>0 && filteredItems.map((item, index)=>(
                      <CatalogItem 
                        key={index}
                        item = {item}
                        appData={appData}
                        setAppData={setAppData}
                        components={components}
                      />
                    ))}
                    {filteredItems.length===0 && <div className="d-flex align-items-center" style={{fontSize: 20, color: "gray", height:"500px"}}>No items found.  Please adjust filter</div>}
                    </div>
                  </div>
             
              {/* Cart */}
              {cart.length>0 && 
                <div className="d-flex bg-light shadow rounded-3" style={{minWidth: "450px", height: "100%", marginRight:0}}>
                <Cart
                  cart = {cart}
                  setCart = {setCart}
                  appData = {appData}
                  setAppData = {setAppData}
                  components = {components}
                  setShowOrderForm = {setShowOrderForm}
                />
                </div>
              }
          </div>
        </div>

      {/* Checkout Order Form */}
      {showOrderForm && 
        <FloatingPanel
            title="Check Out"
            top="50vh"
            left="50vw"
            height="80vh"
            width="60vw"
            appData={appData}
            components={components}
            displayPanel={setShowOrderForm}
            cart={cart} 
        >
          <OrderForm appData={appData} setAppData={setAppData} components={components} setShowOrderForm={setShowOrderForm} cart={cart} />
        </FloatingPanel>
      }

    </div>
  )
}
export default App



