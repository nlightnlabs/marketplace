-- Query for pareto table count:
SELECT 
  "category" AS label, 
  COUNT(DISTINCT "id") AS value,
  round(100 * (COUNT(DISTINCT "id") / SUM(COUNT(DISTINCT "id")) OVER ()),2) AS pct_of_total,
  SUM(COUNT(DISTINCT "id")) OVER (ORDER BY COUNT(DISTINCT "id") DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
  round(100 * (SUM(COUNT(DISTINCT "id")) OVER (ORDER BY COUNT(DISTINCT "id") DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) / SUM(COUNT(DISTINCT "id")) OVER ()),2) AS running_pct_of_total
FROM 
  catalog_items 
GROUP BY 
  label
ORDER BY 
  value DESC;


-- Query for pareto table for sum: 
SELECT
  "business_consumer" AS label, 
  SUM("total_amount") AS value,
  SUM(SUM("total_amount")) OVER () as total,
  100 * (SUM("total_amount") / SUM(SUM("total_amount")) OVER ()) AS pct_of_total,
  SUM(SUM("total_amount")) OVER (ORDER BY SUM("total_amount") DESC) AS running_total,
  100 * (SUM(SUM("total_amount")) OVER (ORDER BY SUM("total_amount") DESC) / SUM(SUM("total_amount")) OVER ()) AS running_pct_of_total
 
FROM 
  orders 
GROUP BY 
  label
ORDER BY 
  value DESC;


  
-- Aggregate values within an array of json text entry in the DB
SELECT
  item->>'category' AS category,
  SUM((item->>'amount')::numeric) AS total_amount
FROM
  orders,
  LATERAL jsonb_array_elements(items::jsonb) AS item //<--this converts a json array of objects into line items table
GROUP BY
  category
ORDER by total_amount desc
;

-- Extract value from json object in postgres:
SELECT 
  SUM((json_data->>'value')::numeric) AS total_value
FROM 
  your_table;


-- Extract value from json object in postgres:
SELECT 
  your_column->>'your_key' AS extracted_value
FROM 
  your_table;


SELECT item->>'category' AS category, SUM((item->>'amount')::numeric) AS total_amount FROM orders, LATERAL jsonb_array_elements(items::jsonb) AS item GROUP BY category ORDER by total_amount desc



-- Filter data:
// const runFilter = async (tableName,updatedFilterConditions) =>{

  //     let filterString = "" 
  //     let filteredList = updatedFilterConditions.filter(item=>item.value!="")
  //     console.log(filteredList)
  //     const numberOfFilters = filteredList.length
  //     console.log(numberOfFilters)

  //     filteredList.map((item,index)=>{  
  //       if(item.value.length !=0 || item.value !=""){
  //           let conditionString = `"${item.db_name}"${item.condition}'${item.db_value}'`
  //           console.log(index)
  //           if(index == 0 || index < numberOfFilters-1){
  //             filterString = `${filterString}${conditionString}`
  //           }else{
  //             filterString = `${filterString} and ${conditionString}`
  //           }
  //       }      
  //     })
  //     let query = ""      
  //     if(filterString.length>0 && filterString !=""){
  //       query = `SELECT * FROM ${tableName} WHERE ${filterString};`
  //       console.log(query)
  //     }else{
  //       query = `SELECT * FROM ${tableName};`
  //       console.log(query)
  //     }
  // }