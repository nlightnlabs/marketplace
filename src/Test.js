import React from 'react'

const Test = () => {

    const environment = "nlightn" // Indicate "Free Agent" if in Freeagent
    const context = {clientAPI:""} //Remove this in FreeAgent
  
    const [FAClient, setFAClient] = React.useState()
  
    React.useEffect(()=>{
      if(environment == "Free Agent"){
          setFAClient(context.clientAPI)
        }else{
          setFAClient(null)
        }
    },[environment, context])

     // Set up local states for this app
     const [userData, setUserData] = React.useState(null);
     const [formData, setFormData] = React.useState(null);
     const [totalAmount, setTotalAmount] = React.useState(0);
     const [totalItems, setTotalItems] = React.useState(0);
     const [cart, setCart] = React.useState([])
     const [users, setUsers] = React.useState([])
     const [facilities, setFacilities] = React.useState([])
     const [businessUnits, setBusinessUnits] = React.useState([])
     const [icons, setIcons] = React.useState([])
 
     const windowSize = React.useRef({width: window.innerWidth, height: window.innerHeight});
     const [showCart, setShowCart] = React.useState(false)
     const [showOrderForm, setShowOrderform] = React.useState(false)
 
     const [appData, setAppData] = React.useState({
       userData,
       formData
     });

   
  
  
    React.useEffect(()=>{
     
    },[])

  return (
    <div>test</div>
  )
}

export default Test