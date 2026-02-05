const router = require("express").Router();
const protectedRoutes = require("../middlewares/auth.middleware");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

router.post("/", protectedRoutes(), createProject);
router.get("/", protectedRoutes(), getProjects);
router.get("/:id", protectedRoutes(), getProjectById);
router.patch("/:id", protectedRoutes(), updateProject);
router.delete("/:id", protectedRoutes(), deleteProject);

module.exports = router;
