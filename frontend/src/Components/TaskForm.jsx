function TaskForm({
  onCreate,
  isSubmitting,
  users,
  initialValues,
  submitLabel,
  showAssign,
}) {
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
    if (showAssign) {
      payload.assignedTo = formData.get("assignedTo")?.toString() || undefined;
    }
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
          defaultValue={initialValues?.title || ""}
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          placeholder="Short task summary"
          rows={3}
          defaultValue={initialValues?.description || ""}
          required
        />
      </label>
      <div className="task-row">
        <label>
          Status
          <select
            name="status"
            defaultValue={initialValues?.status || "pending"}
          >
            <option value="pending">Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Priority
          <select
            name="priority"
            defaultValue={initialValues?.priority || "medium"}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      {showAssign ? (
        <label>
          Assign to
          <select
            name="assignedTo"
            defaultValue={initialValues?.assignedTo || ""}
          >
            <option value="">Unassigned</option>
            {(users || []).map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label>
        Due date
        <input
          name="dueDate"
          type="date"
          defaultValue={
            initialValues?.dueDate
              ? new Date(initialValues.dueDate).toISOString().slice(0, 10)
              : ""
          }
        />
      </label>
      <button className="primary-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel || "Create task"}
      </button>
    </form>
  );
}

export default TaskForm;
