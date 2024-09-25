import {
  createContext,
  useReducer,
} from "react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {

  const INITIAL_STATE = {
    selectedMobile: null,
    conversion: {},
    selectedName:null
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          selectedMobile: action.payload.mobile,
          conversion: action.payload.conversation,
          selectedName:action.payload.name,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
