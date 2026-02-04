const router = require("express").Router();
const protectedRoutes = require("../middlewares/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/user.controller");

router.get("/me", protectedRoutes(), getProfile);
router.patch("/me", protectedRoutes(), updateProfile);

module.exports = router;
