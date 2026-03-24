import Button from "../Button";
import { useTask } from "./TaskContext";

function StepAdd() {
  const { addStep } = useTask();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const value = evt.target.title.value.trim();
    if (!value) return;
    addStep(value);
    evt.target.reset();
  };

  return (
    <li className="step step-add">
      <form className="step-form" onSubmit={handleSubmit}>
        <input
          className="step-input"
          placeholder="Добавить этап"
          name="title"
        />
        <Button icon="plus" label="Добавить этап" />
      </form>
    </li>
  );
}

export default StepAdd;
