const initialState = {
  sequenceName:'My Sequence',
  sqId:null,
  nodes:[],
};

function createReducer(state = initialState, action) {
  switch (action.type) {

    case 'RESET_SEQUENCE':
      return {
        ...initialState
      };
    case 'UPDATESQID':
      return {
        ...state,
        sqId:action.id
      }
    case "UPDATENODE":
      console.log(action)
      return {
        ...state,
        nodes: state.nodes.map(node => {
         
          if (node.id === action.id) {
         
            let updatedData = {
              ...node.data,
              content: action.data
            };
    
            // Conditionally add `choice` to the `data` if it's provided in the action
            if (action.choice !== undefined) {
              updatedData.choice = action.choice;
            }
            
    
            return {
              ...node,
              data: updatedData
            };
          }
          return node;
        })
      };
      case 'UPDATESQNM':
        console.log(action.data);
        return { 
          ...state, 
          sequenceName: action.data
        };
    
        case 'ADDNODE':
          console.log(action.payload);
          const newData = { ...state }; // Copy the existing state
      
          // Check if payload is an array
          if (Array.isArray(action.payload)) {
              newData.nodes = [...state.nodes, ...action.payload]; // Spread and combine if it's an array
          } else {
              newData.nodes = [...state.nodes, action.payload]; // Simply append if it's a single object
          }
      
          return newData;
      
    
    default:
      return state;
  }
}

export default createReducer;
