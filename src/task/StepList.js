import { useState, Fragment } from "react";
import Step from "./Step";
import StepAdd from "./StepAdd";
import { useTask } from "./TaskContext";

function DropZone({ position, isVisible, onDrop }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <li
      className={[
        "drop-zone",
        isVisible ? "drop-zone--visible" : "",
        isOver && isVisible ? "drop-zone--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onDragEnter={(e) => {
        e.stopPropagation();
        setIsOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setIsOver(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        setIsOver(false);
        onDrop(position);
      }}
    />
  );
}

function StepList({ steps }) {
  const { moveStep } = useTask();
  const [draggingStepId, setDraggingStepId] = useState(null);

  const handleDrop = (position) => {
    if (draggingStepId !== null) {
      moveStep(draggingStepId, position);
      setDraggingStepId(null);
    }
  };

  const isDragging = draggingStepId !== null;

  return (
    <ol className="step-list">
      <DropZone position={0} isVisible={isDragging} onDrop={handleDrop} />
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <Step
            step={step}
            isDragging={draggingStepId === step.id}
            onDragStart={() => setDraggingStepId(step.id)}
            onDragEnd={() => setDraggingStepId(null)}
          />
          <DropZone
            position={index + 1}
            isVisible={isDragging}
            onDrop={handleDrop}
          />
        </Fragment>
      ))}
      <StepAdd />
    </ol>
  );
}

export default StepList;
