import React, {useRef, useState, useEffect} from "react"
import MultiInput from "./MultiInput"
import { UTCToLocalDate } from "../functions/formatValue"

const OrderForm = (props)=>{

    const appData = props.appData
    const setAppData = props.setAppData
    const [cart, setCart] = useState(props.cart)
    const businessUnits = appData.businessUnits
    const user = appData.user
    const users = appData.users
    const employees = appData.employees
    const facilities = appData.facilities
    const totalAmount = appData.totalAmount
    const totalItems = appData.totalItems
    const environment = appData.environment
    const addRecord = appData.addRecord
    const setShowOrderForm = props.setShowOrderForm

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

      let appName = ""
      let orderForm = {}

      if(environment === "freeagent"){
        
        appName = "custom_app_15"
        
        orderForm = {
          subject: finalFormData.order_name,
          total_amount: finalFormData.total_amount,
          number_of_items: finalFormData.number_of_items,
          business_consumer: employees.data.find(record=>record.name_1===finalFormData.business_consumer).seq_id, 
          business_units: businessUnits.data.find(record=>record.name===finalFormData.business_unit).seq_id, 
          ship_to_location: facilities.data.find(record=>record.name===finalFormData.ship_to_location).seq_id, 
          need_by: formatDateInput(finalFormData.need_by),
          notes: finalFormData.notes
        }
      }else{

        appName = "orders"

        orderForm = {
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
      }

      await addRecord(appName, orderForm)

      alert(`Order has been created and is being reviewed: ${JSON.stringify(finalFormData)}`)
      setCart([])
      setShowOrderForm(false)
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
              appData = {appData}
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

  export default OrderForm