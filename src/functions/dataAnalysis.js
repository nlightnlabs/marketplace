export const createParetoData = (data)=>{


    // get total
    let total=0
    data.map(item=>{
      total += 1
    })
  
     // Additional fields needed for pareto chart
      var pareto_data =[]
      var running_total = 0
      data.forEach((item)=>{
        var value = parseFloat(item.value)
        var pct_of_total = parseFloat((100*value / total).toFixed(2))
        running_total = parseFloat((running_total + parseFloat(item.value)).toFixed(0))
        var running_pct_of_total = parseFloat((100*running_total / total).toFixed(2))
        var new_data = {pct_of_total, running_total,running_pct_of_total}
        var updated_item = {...item,...new_data}
        pareto_data.push(updated_item)
      })
    
    //get labels
    let labels = []
    pareto_data.map(item=>{
      labels.push(item['label'])
    })
    
    //get item values
    let values=[]
    pareto_data.map(item=>{
      values.push(item['value'])
    })

    let pct_of_total_values=[]
    pareto_data.map(item=>{
      pct_of_total_values.push(item['pct_of_total'])
    })

    let running_total_values=[]
    pareto_data.map(item=>{
      running_total_values.push(item['running_total'])
    })
    
    //get pct running total values
    let pct_running_total_values=[]
    pareto_data.map(item=>{
      pct_running_total_values.push(item['running_pct_of_total'])
    })
    
    return {pareto_data, labels,values,pct_of_total_values, running_total_values,pct_running_total_values}
   }