const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task");
const verify = require("../middlewares/auth");

router.post("/:projectId/create", verify, tasks.createTask);

router.get("/:id", verify, tasks.getTaskById);

router.post("/:id/edit", verify, tasks.editTask);

router.delete("/:id", verify, tasks.deleteTask);

router.get("/:id/get-comments", verify, tasks.getComments);

module.exports = router;
