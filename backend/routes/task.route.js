const router = require("express").Router();
const protectedRoutes = require("../middlewares/auth.middleware");
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

router.post("/projects/:projectId/tasks", protectedRoutes(), createTask);
router.get("/projects/:projectId/tasks", protectedRoutes(), getTasksByProject);
router.get(
  "/projects/:projectId/tasks/:taskId",
  protectedRoutes(),
  getTaskById,
);
router.patch(
  "/projects/:projectId/tasks/:taskId",
  protectedRoutes(),
  updateTask,
);
router.delete(
  "/projects/:projectId/tasks/:taskId",
  protectedRoutes(),
  deleteTask,
);

module.exports = router;
