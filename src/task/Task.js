import { useState } from "react";
import TaskHeader from "./TaskHeader";
import StepList from "./StepList";
import { TaskProvider } from "./TaskContext";

function Task({
  task,
  isOpen,
  onToggleOpen,
  editTask,
  deleteTask,
  completeTask,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const [isEditable, setEditable] = useState(false);

  const completedSteps = task.steps.filter((s) => s.done).length;
  const totalSteps = task.steps.length;

  const className = [
    "card",
    task.done ? "card--done" : "",
    isDragging ? "card--dragging" : "",
    isDragOver ? "card--drag-over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TaskProvider taskId={task.id}>
      <li
        className={className}
        draggable
        onDragStart={onDragStart}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver();
        }}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
      >
        <TaskHeader
          task={task}
          isEditable={isEditable}
          setEditable={setEditable}
          editTask={editTask}
          isOpen={isOpen}
          onToggleOpen={onToggleOpen}
        />
        {totalSteps > 0 && (
          <progress
            className="card-progress"
            value={completedSteps}
            max={totalSteps}
          />
        )}
        {isOpen && <StepList steps={task.steps} />}
        <ul className="card-controls">
          <li className="card-control-drag" title="Перетащить">
            <img draggable={false} src="icons/drag.svg" alt="Переместить" />
          </li>
          <li>
            <button
              className={`card-control${task.done ? " card-control--done" : ""}`}
              onClick={() => completeTask(task.id)}
            >
              {task.done ? "Отменить" : "Выполнено"}
            </button>
          </li>
          <li>
            <button
              className="card-control"
              onClick={() => deleteTask(task.id)}
            >
              Удалить
            </button>
          </li>
        </ul>
      </li>
    </TaskProvider>
  );
}

export default Task;
