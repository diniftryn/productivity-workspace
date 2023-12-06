import { createContext, useReducer } from "react";

export const TasksContext = createContext();

export const taskReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_TASK":
      return {
        tasks: [...state.tasks, action.payload]
      };
    case "SET_TASKS":
      return {
        tasks: action.payload
      };
    case "UPDATE_TASK":
      return {
        tasks: state.tasks.map(e => {
          if (e._id === action.payload._id) {
            return action.payload;
          } else {
            return e;
          }
        })
      };
    case "DELETE_TASK":
      return {
        tasks: state.tasks.filter(e => e._id !== action.payload._id)
      };
    default:
      return state;
  }
};

export const TasksContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: null
  });
  return <TasksContext.Provider value={{ ...state, dispatch }}>{children}</TasksContext.Provider>;
};
