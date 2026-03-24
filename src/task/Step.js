import { useState } from "react";
import Button from "../Button";
import { useTask } from "./TaskContext";

function Step({ step, isDragging, onDragStart, onDragEnd }) {
  const { editStep, deleteStep, toggleStep } = useTask();
  const [isEditable, setEditable] = useState(false);

  const handleEdit = (evt) => {
    evt.preventDefault();
    editStep(step.id, evt.target.title.value);
    setEditable(false);
  };

  if (isEditable) {
    return (
      <li className="step">
        <form className="step-form" onSubmit={handleEdit}>
          <input
            className="step-input"
            defaultValue={step.title}
            name="title"
            autoFocus
          />
          <button className="icon-button">
            <img src="/icons/check.svg" alt="Сохранить" />
          </button>
        </form>
      </li>
    );
  }

  return (
    <li
      className={[
        "step",
        step.done ? "step--done" : "",
        isDragging ? "step--dragging" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart();
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
    >
      <label className="step-label">
        <input
          type="checkbox"
          checked={step.done}
          onChange={() => toggleStep(step.id)}
        />
        <span className="step-title">{step.title}</span>
      </label>
      <div className="step-actions">
        <Button icon="pencil" label="Изменить" onClick={() => setEditable(true)} />
        <Button icon="trash" label="Удалить" onClick={() => deleteStep(step.id)} />
        <img
          className="step-drag-handle"
          draggable={false}
          src="icons/drag.svg"
          alt="Переместить"
        />
      </div>
    </li>
  );
}

export default Step;
