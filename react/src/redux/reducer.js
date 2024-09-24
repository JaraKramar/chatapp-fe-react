const initialState = {
    selectedModel: model_options[0].value,  // Default value
  };
  
  const modelReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SELECTED_MODEL':
        return {
          ...state,
          selectedModel: action.payload,
        };
      default:
        return state;
    }
  };

export default modelReducer;