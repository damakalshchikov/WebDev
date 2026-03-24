import { useState } from "react";
import Task from "./Task";
import TaskAdd from "./TaskAdd";
import { TasksProvider, useTasks } from "./TasksContext";

function TaskListInner() {
  const { tasks, addTask, editTask, deleteTask, completeTask, moveTask } =
    useTasks();
  const [openTaskId, setOpenTaskId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const toggleOpen = (id) =>
    setOpenTaskId((prev) => (prev === id ? null : id));

  const handleDragStart = (id) => setDraggingId(id);
  const handleDragOver = (id) => setDragOverId(id);
  const handleDrop = (id) => {
    moveTask(draggingId, id);
    setDraggingId(null);
    setDragOverId(null);
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const sortedTasks = [
    ...tasks.filter((t) => !t.done),
    ...tasks.filter((t) => t.done),
  ];

  return (
    <ol className="lane">
      {sortedTasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          isOpen={openTaskId === task.id}
          onToggleOpen={() => toggleOpen(task.id)}
          editTask={editTask}
          deleteTask={deleteTask}
          completeTask={completeTask}
          isDragging={draggingId === task.id}
          isDragOver={dragOverId === task.id && draggingId !== task.id}
          onDragStart={() => handleDragStart(task.id)}
          onDragOver={() => handleDragOver(task.id)}
          onDrop={() => handleDrop(task.id)}
          onDragEnd={handleDragEnd}
        />
      ))}
      <TaskAdd addTask={addTask} />
    </ol>
  );
}

function TaskList() {
  return (
    <TasksProvider>
      <TaskListInner />
    </TasksProvider>
  );
}

export default TaskList;
