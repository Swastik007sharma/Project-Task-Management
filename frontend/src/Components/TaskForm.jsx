function TaskForm({ onCreate, isSubmitting }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: formData.get("title")?.toString().trim(),
      description: formData.get("description")?.toString().trim(),
      status: formData.get("status")?.toString(),
      priority: formData.get("priority")?.toString(),
      dueDate: formData.get("dueDate")?.toString() || null,
    };
    await onCreate?.(payload);
    form.reset();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Task title
        <input
          name="title"
          type="text"
          placeholder="Design hero section"
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          placeholder="Short task summary"
          rows={3}
          required
        />
      </label>
      <div className="task-row">
        <label>
          Status
          <select name="status" defaultValue="pending">
            <option value="pending">Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Priority
          <select name="priority" defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <label>
        Due date
        <input name="dueDate" type="date" />
      </label>
      <button className="primary-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create task"}
      </button>
    </form>
  );
}

export default TaskForm;
