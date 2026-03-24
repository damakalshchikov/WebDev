import Button from "../Button";

function TaskHeader({
  task,
  isEditable,
  setEditable,
  editTask,
  isOpen,
  onToggleOpen,
}) {
  const { title } = task;

  const handleEditTask = (evt) => {
    evt.preventDefault();
    editTask(task.id, evt.target.title.value);
    setEditable(false);
  };

  if (isEditable) {
    return (
      <header className="card-header">
        <form className="card-title-form" onSubmit={handleEditTask}>
          <input
            className="card-title card-title-input"
            defaultValue={title}
            name="title"
          />
          <button className="icon-button">
            <img src="/icons/check.svg" alt="Сохранить" />
          </button>
        </form>
      </header>
    );
  }

  return (
    <header className="card-header">
      <div className="card-header-content">
        <button className="icon-button card-caret" onClick={onToggleOpen}>
          <img
            src="/icons/caret.svg"
            alt={isOpen ? "Скрыть" : "Показать"}
            className={isOpen ? "caret--open" : ""}
          />
        </button>
        <p className="card-title">{title}</p>
        {!task.done && (
          <Button
            className="card-edit-button"
            icon="pencil"
            label="Изменить"
            onClick={() => setEditable(true)}
          />
        )}
      </div>
    </header>
  );
}

export default TaskHeader;
