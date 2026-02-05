function TaskList({ tasks, onDelete }) {
  if (!tasks.length) {
    return <p className="muted">No tasks yet.</p>;
  }

  const handleDelete = (task) => {
    const confirmed = window.confirm(
      `Delete task "${task.title}"? This action cannot be undone.`,
    );
    if (confirmed) onDelete?.(task._id);
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task._id}>
          <div>
            <h3>{task.title}</h3>
            <p className="muted">{task.description}</p>
            <div className="task-meta">
              <span>{task.status}</span>
              <span>{task.priority}</span>
            </div>
          </div>
          <button
            className="ghost-btn"
            type="button"
            onClick={() => handleDelete(task)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
