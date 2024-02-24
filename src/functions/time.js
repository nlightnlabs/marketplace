export const UTCToLocalTime =(utcDateString)=>{
    const utcDate = new Date(utcDateString);
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
    return localTime.toLocaleString(); // Adjust the output format as needed
  }
  // Example usage:
//   const utcTimeString = '2023-12-21T00:00:00Z'; // Replace with your UTC time string
//   const localTime = convertUTCToLocal(utcTimeString);
//   console.log('UTC Time:', utcTimeString);
//   console.log('Local Time:', localTime);


export const UTCToLocalDate =(utcDateString)=>{
  const utcDate = new Date(utcDateString);
  const timezoneOffset = utcDate.getTimezoneOffset();
  const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
  return localTime.toLocaleString().slice(0,localTime.toLocaleString().search(",")); // Adjust the output format as needed
}

