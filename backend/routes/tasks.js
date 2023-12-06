const express = require("express");
const { createTask, getTasks, getTaskById, deleteTaskById, updateTaskById } = require("../controller/taskController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.post("/", createTask);

router.delete("/:id", deleteTaskById);

router.patch("/:id", updateTaskById);

// export default router;

module.exports = router;
