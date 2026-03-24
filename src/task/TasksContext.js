import { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "./reducer";
import initialState from "./fixture";

const TasksContext = createContext(null);

function getInitialState() {
  const stored = JSON.parse(
    localStorage.getItem("task-manager-items-list")
  );
  // Миграция: добавляем steps: [] к задачам из старого формата
  const tasks = stored || initialState;
  return tasks.map((t) => ({ steps: [], ...t }));
}

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, null, getInitialState);

  useEffect(() => {
    localStorage.setItem("task-manager-items-list", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title) => dispatch({ type: "ADD_TASK", title });
  const editTask = (id, title) => dispatch({ type: "EDIT_TASK", id, title });
  const deleteTask = (id) => dispatch({ type: "DELETE_TASK", id });
  const completeTask = (id) => dispatch({ type: "COMPLETE_TASK", id });
  const moveTask = (fromId, toId) =>
    dispatch({ type: "MOVE_TASK", fromId, toId });

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        deleteTask,
        completeTask,
        moveTask,
        dispatch,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}
