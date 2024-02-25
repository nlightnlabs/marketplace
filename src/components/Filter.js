import React, {useRef, useState, useEffect} from "react"
import MultiInput from "./MultiInput";

const Filter = (props)=>{
    
    const appData = props.appData;
    const icons = appData.icons
    const iconButtonStyle = appData.iconButtonStyle
    const [filterCriteria, setFilterCriteria] = useState([])
    const setFilteredItems = props.setFilteredItems
    const items = appData.items

    useEffect(()=>{
      setFilterCriteria(appData.filterCriteria)
    },[props])


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
          applyFilter()
      }
      
    }
      
      const applyFilter = ()=>{
        
        let filtered = []    
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
                src={icons.find(item=>item.name==="filter").image} 
                style={iconButtonStyle} 
                onClick={(e)=>applyFilter(e)} 
                title="Apply filter"
                alt="Filter icon" 
                />}


                {icons.length>0 && 
                <img name="reset_filter" 
                src={icons.find(item=>item.name==="reset").image} 
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

  export default Filter