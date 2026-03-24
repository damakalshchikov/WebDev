function generateId() {
  return Math.random() * 1000000;
}

export default function reducer(tasks, action) {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...tasks,
        { id: generateId(), title: action.title, done: false, steps: [] },
      ];

    case "EDIT_TASK":
      return tasks.map((t) =>
        t.id === action.id ? { ...t, title: action.title } : t
      );

    case "DELETE_TASK":
      return tasks.filter((t) => t.id !== action.id);

    case "COMPLETE_TASK":
      return tasks.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t
      );

    case "MOVE_TASK": {
      const from = tasks.findIndex((t) => t.id === action.fromId);
      const to = tasks.findIndex((t) => t.id === action.toId);
      const result = [...tasks];
      const [removed] = result.splice(from, 1);
      result.splice(to, 0, removed);
      return result;
    }

    case "ADD_STEP":
      return tasks.map((t) =>
        t.id === action.taskId
          ? {
              ...t,
              steps: [
                ...t.steps,
                { id: generateId(), title: action.title, done: false },
              ],
            }
          : t
      );

    case "EDIT_STEP":
      return tasks.map((t) =>
        t.id === action.taskId
          ? {
              ...t,
              steps: t.steps.map((s) =>
                s.id === action.stepId ? { ...s, title: action.title } : s
              ),
            }
          : t
      );

    case "DELETE_STEP":
      return tasks.map((t) =>
        t.id === action.taskId
          ? { ...t, steps: t.steps.filter((s) => s.id !== action.stepId) }
          : t
      );

    case "TOGGLE_STEP":
      return tasks.map((t) =>
        t.id === action.taskId
          ? {
              ...t,
              steps: t.steps.map((s) =>
                s.id === action.stepId ? { ...s, done: !s.done } : s
              ),
            }
          : t
      );

    case "MOVE_STEP": {
      return tasks.map((t) => {
        if (t.id !== action.taskId) return t;
        const steps = [...t.steps];
        const fromIndex = steps.findIndex((s) => s.id === action.stepId);
        const [removed] = steps.splice(fromIndex, 1);
        // position — индекс зоны сброса в исходном массиве; корректируем после удаления
        const targetIndex =
          action.position > fromIndex ? action.position - 1 : action.position;
        steps.splice(targetIndex, 0, removed);
        return { ...t, steps };
      });
    }

    default:
      return tasks;
  }
}
