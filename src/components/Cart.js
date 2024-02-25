import React, {useRef, useState, useEffect} from "react"

const Cart = (props)=>{

    const appData = props.appData
    const setAppData = props.setAppData
    const cart = props.cart
    const setCart = props.setCart

    const icons = appData.icons
    const currencySymbol = appData.currencySymbol

    const [totalAmount, setTotalAmount] = React.useState(appData.totalAmount)
    const [totalItems, setTotalItems] = React.useState(appData.totalItems)

    useEffect(()=>{
      setCart(props.cart)
    },[props.cart])

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

    const resetCart = ()=>{
      setCart([])
    }

    const cellStyle={
      fontSize: "12px"
    }

    const iconButtonStyle = {
      height: "30px",
      width: "30px",
      cursor: "pointer"
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
            src={`${icons.find(item=>item.name==="reset").image}`} 
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
                      src={icons.length>0 && icons.find(i=>i.name==="remove").image} 
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

  export default Cart