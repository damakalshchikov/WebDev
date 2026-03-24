import { createContext, useContext } from "react";
import { useTasks } from "./TasksContext";

const TaskContext = createContext(null);

export function TaskProvider({ taskId, children }) {
  const { dispatch } = useTasks();

  const addStep = (title) => dispatch({ type: "ADD_STEP", taskId, title });
  const editStep = (stepId, title) =>
    dispatch({ type: "EDIT_STEP", taskId, stepId, title });
  const deleteStep = (stepId) =>
    dispatch({ type: "DELETE_STEP", taskId, stepId });
  const toggleStep = (stepId) =>
    dispatch({ type: "TOGGLE_STEP", taskId, stepId });
  const moveStep = (stepId, position) =>
    dispatch({ type: "MOVE_STEP", taskId, stepId, position });

  return (
    <TaskContext.Provider
      value={{ addStep, editStep, deleteStep, toggleStep, moveStep }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  return useContext(TaskContext);
}
