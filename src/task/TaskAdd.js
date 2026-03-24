import Button from "../Button";

function TaskAdd({ addTask }) {
  const handleAddTask = (evt) => {
    evt.preventDefault();
    addTask(evt.target.title.value);
    evt.target.reset();
  };

  return (
    <li className="card">
      <header className="card-header card-header-new">
        <form className="card-title-form" onSubmit={handleAddTask}>
          <input
            className="card-title card-title-input"
            placeholder="Добавить задачу"
            name="title"
          />
          <Button icon="plus" label="Добавить" />
        </form>
      </header>
    </li>
  );
}

export default TaskAdd;
