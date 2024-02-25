export const formatValue = (inputValue, format, currencySymbol, digits, abbreviate)=>{
    
  const numericalValue = getValue(inputValue, format)

  let formattedValue = ""
  let prefix = ""
  let suffix = ""
  let divisor = 1
  
  if(format === "percent"){
    suffix = "%"
    divisor = (1/100)
  }
  
  else{
    if(format ==="currency"){
      prefix = currencySymbol
    }else{
      prefix = ""
    }
    
    if(abbreviate){
      if(numericalValue>=(10**12)){
        divisor = 10**12
        suffix = "T"
      }else if(numericalValue>=(10**9)){
        divisor = 10**9
        suffix = "B"
      }else if(numericalValue>=(10**6)){
        divisor = 10**6
        suffix = "M"
      }else if(numericalValue>=(1000)){
        divisor = 1000
        suffix = "K"
      }
      else{
        divisor = 1
        suffix = ""
      }
  }
  
  }
  formattedValue = `${prefix}${parseFloat((numericalValue/divisor).toFixed(digits)).toLocaleString("en-US")}${suffix}`
  return formattedValue
}


export const getValue =  (inputValue, format)=>{

  let stringValue = inputValue.toString().toLowerCase()
  let numericalValue = parseFloat(Number(stringValue.replace(/[^0-9.]/g,''))); 
  let outputValue = 0
  let exponent = 1
  
  if(!inputValue){
    outputValue = 0
    return outputValue
  }

//   Adjust for percentage formatting
  else if(format === "percent" || stringValue.toLowerCase().search("%")>=0 || stringValue.toLowerCase().search("pct")>=0 || stringValue.toLowerCase().search("percent")>=0){ 
   return outputValue = parseFloat(numericalValue/100);
  }

  //   Adjust for exponential formatting
  else if(stringValue.search("e")>=0){
        exponent = parseFloat(stringValue.split("e")[1].replace(/[^0-9.]/g,''));
        numericalValue = parseFloat(stringValue.split("e")[0].replace(/[^0-9.]/g,''));
        return outputValue = numericalValue*(10**exponent)
  }
  
  //   Adjust for abbreviated formatting (Millions, Billions, etc)
  else if(stringValue.search("t")>=0 || stringValue.search("tn")>=0 || stringValue.search("trillion")>=0){
   return outputValue = parseFloat(numericalValue*(10**12));
 }

  else if(stringValue.search("b")>=0 || stringValue.search("bn")>=0 || stringValue.toLowerCase().search("billion")>=0){ 
   return  outputValue = parseFloat(numericalValue*(10**9));
}

  else if(stringValue.search("m")>=0 || stringValue.search("mn")>=0 || stringValue.search("million")>=0){
    return outputValue = parseFloat(numericalValue*(10**6));
  }
  
  else if(stringValue.search("k")>=0 || stringValue.search("thousand")>=0){
    return outputValue = parseFloat(numericalValue*(1000));
  }
  
  else {
    return outputValue = numericalValue
  }
  
}

export const toProperCase = (str)=>{
  return str.split(" ")
   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
   .join(" ");
}


export const UTCToLocalTime =(utcDateString)=>{
  const utcDate = new Date(utcDateString);
  const timezoneOffset = utcDate.getTimezoneOffset();
  const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
  return localTime.toLocaleString(); // Adjust the output format as needed
}

export const UTCToLocalDate =(utcDateString)=>{
  const utcDate = new Date(utcDateString);
  const timezoneOffset = utcDate.getTimezoneOffset();
  const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
  return localTime.toLocaleString().slice(0,localTime.toLocaleString().search(","));
}

export const formatDateInput = (inputValue)=>{
  let dateValue = new Date(inputValue);  
  let dd = String(dateValue.getDate()).padStart(2, '0'); 
  let mm = String(dateValue.getMonth() + 1).padStart(2, '0'); let yyyy = dateValue.getFullYear(); 
  let formattedDate = yyyy + '-' + mm + '-' + dd; 
  return formattedDate
}


export const limitText =(textContent,maxLength)=>{
  if (textContent !=="" && textContent !=null){
    var text = textContent.toString();
    if (text.length > maxLength) {
      text=text.substring(0, maxLength) + '...';
    }
    return(text)
  }
}