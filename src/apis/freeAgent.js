


//Set up local states for freeAgent
const [freeAgentApp, setFreeAgentApp] = useState(null);

//script to itnegrate FreeAgent library
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
useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');


//INPUT FROM FREEAGENT 

 //Specifiy App to bring in
 const FREE_AGENT_APP_NAME = 'catalog_items';

const initializeFreeAgentConnection = () => {
    const FAAppletClient = window.FAAppletClient;
    
    //Initialize the connection to the FreeAgent this step takes away the loading spinner
    const FAClient = new FAAppletClient({
        appletId: 'nlightnlabs-bes-home',
    });

    //Bridget to access freeagent apps
    FAClient.listEntityValues({
        entity: FREE_AGENT_APP_NAME,
        limit: 100,
        fields: [
            "seq_id",
            "description",
            "created",
            "owner",
           //  add other fields as needed
        ]
    }, (freeAgentApp) => {
            console.log('initializeFreeAgentConnection Success!', freeAgentApp);
        if (freeAgentApp) {
         setFreeAgentApp(freeAgentApp);
        }
     });

    
    // Function to create a new record/entity in FA app
      FAClient.createEntity({
          entity:"requests",
          field_values: {
              request_type: "",
              subject: "",
              requester: "",
          }
      })

    // Function to update or delete a record/entity in FA app
      FAClient.updateEntity({
          entity:"requests", // app name
          id:"", //What record to update
          field_values: {
              request_type: "",
              subject: "",
              requester: "",
              deleted: false //ONLY USE IF need to delete
          }
      })
};