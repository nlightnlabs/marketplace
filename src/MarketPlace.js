import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import * as freeAgentApi from "./apis/freeAgent.js"
import * as nlightnApi from './apis/nlightn.js';
import Cart from "./components/Cart.js"
import Filter from "./components/Filter.js"
import CatalogItem from "./components/CatalogItem.js"
import OrderForm from "./components/OrderForm.js"
import FloatingPanel from "./components/FloatingPanel.js"


function MarketPlace() {

  const [appData, setAppData] = useState({
    icons: []
})

    let environment = "freeagent"
    if(process.env.NODE_ENV ==="development"){
        environment = "nlightn"
    }
    
    const [icons, setIcons] = useState([])
    const [apps, setApps] = useState([])
    const [appList, setAppList] = useState([])
    
    const [data, setData] = useState([]);
    const [fields, setFields] = useState([])
    const [appLabel, setAppLabel] = useState("")
    const [appName, setAppName] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({})
    const [selectedRecordId, setSelectedRecordId] = useState(null)

    const [updatedForm, setUpdatedForm] = useState({})

    const [showLoadingModal, setShowLoadingModal] = useState(false)

    const useExternalScript = (src) => {
        useEffect(() => {
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
        const FAClient = new FAAppletClient({
            appletId: 'nlightn_marketplace',
        });
        window.FAClient = FAClient;

        FAClient.listEntityValues({
            entity: "icon",
        }, (response) => {
            console.log('Successfully loaded icons: ', response);
            setIcons(response)
        });
    }

    const getData = async (appName) => {

        let response = []
        if(environment==="freeagent"){
            const FAClient = window.FAClient;
            response = await freeAgentApi.getFAAllRecords(FAClient, appName);
            console.log("data retrieved: ", response)
        }else{
            
            response = await nlightnApi.getTable(appName)
            return response.data
        }
        console.log(response)
        return response
    };

    
    //Get data for all apps
    const getApps = async (appname)=>{
        const response = await getData(appname)
        setApps(response)
        let list = []
        response.map(item=>{
            list.push(item.label)
        })
        setAppList(list)
    }

    useEffect(()=>{
       setTimeout(()=>{
            let appname = null    
            if(process.env.NODE_ENV==="production" && environment==="freeagent"){
                appname = "web_app"
            }else{
                appname = "apps"
            }
            getApps(appname)
       },500) 
    },[])

    const getIcons = async()=>{
      let appName = ""
      if(environment ==="freeagent"){
        appName = "icon"
      }else{
        appName = "icons" 
      }
      const data = await getData(appName)
    
      setAppData(prevAppData => ({
        ...prevAppData,
        icons: data
      }));
    };


    useEffect(()=>{
      getIcons();
    })


    const handleGetData = async ()=>{
        
        const response = await getData(appName)  
        setData(response)
        
        let fieldList = []
        if (response.length > 0) {
            Object.keys(response[0]).map((field, index) => {
                fieldList.push({ headerName: toProperCase(field.replaceAll("_", " ")), field: field, filter: true });
                setFormData(prev => ({ ...prev, ...{ [field]: "" } }));
            });
        }
        setFields(fieldList);
    }

    

    const updateRecord = async () => {

        if(environment === "freeagent"){
            try {
                const FAClient = window.FAClient;
                freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId, updatedForm)
                setTimeout(async ()=>{
                    const response = await getData(appName)  
                    setData(response)
                },1000)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
            await nlightnApi.updateRecord(appName,"id", selectedRecordId,updatedForm)
            const updatedData = await getData(appName)
            setData(updatedData)
        }
    }


    const addRecord = async () => {
        if(environment == "freeagent"){
            try {
                const FAClient = window.FAClient;
    
                delete updatedForm.id
                delete updatedForm.seq_id
    
                await freeAgentApi.addFARecord(FAClient, appName, updatedForm)
                setInterval(()=>{
                    setShowLoadingModal(true)
                },600)
                setTimeout(async ()=>{
                    const response = await getData(appName)  
                    setData(response)
                    setShowLoadingModal(false)
                },500)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
            const response = await nlightnApi.addRecord(appName, updatedForm)
            const updatedData = await getData(appName)
            console.log(updatedData)
            setData(updatedData)
        }
    }
    
    const deleteRecord = async () => {
        if(environment == "freeagent"){
            try {
                const FAClient = window.FAClient;
                await freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId)
                setInterval(()=>{
                    setShowLoadingModal(true)
                },600)
                setTimeout(async ()=>{
                    const response = await getData(appName)  
                    setData(response)
                    setShowLoadingModal(false)
                },500)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
            await nlightnApi.deleteRecord(appName,"id",selectedRecordId)
            const updatedData = await getData(appName)
            setData(updatedData)
        }
    }

    const pageStyle = {
        fontSize: "12px",
        height: environment==="freeagent" ? "700px" : "100vh",
        width: "100%",
        overflow: "hidden"
    }

    const handleSelectApp = (e)=>{
        const {name, value} = e.target 
        setAppLabel(value)

        let system_name = apps.find(item =>item.label ===value).name
        setAppName(system_name)
    }

    const handleInputChange=(e)=>{
        const {name, value} = e.target 
        setFormData({...formData,...{[name]:value}})
        setUpdatedForm({...updatedForm,...{[name]:value}})
    }

    const onCellClicked = (e) => {
        setSelectedRecordId(e.data.id)
        setFormData(e.data)
      }

      useEffect(()=>{
        
      },[data])



  return (
    <div className="d-flex flex-column" style={pageStyle}>

        
    </div>
  );
}

export default MarketPlace;