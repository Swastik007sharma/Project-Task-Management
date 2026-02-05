function ProjectForm({ onCreate, isSubmitting, initialValues, submitLabel }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: formData.get("title")?.toString().trim(),
      description: formData.get("description")?.toString().trim(),
    };
    await onCreate?.(payload);
    form.reset();
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <label>
        Project title
        <input
          name="title"
          type="text"
          placeholder="Marketing Launch"
          defaultValue={initialValues?.title || ""}
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          placeholder="Short summary of the project"
          rows={3}
          defaultValue={initialValues?.description || ""}
          required
        />
      </label>
      <button className="primary-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel || "Create project"}
      </button>
    </form>
  );
}

export default ProjectForm;
