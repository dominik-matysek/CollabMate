const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task");
const { verifyToken } = require("../middlewares/auth");

router.post("/projects/:projectId/tasks/create", verifyToken, tasks.createTask); //CZŁONEK ZESPOŁU + CZŁONEK PROJEKTU

router.get("/projects/:projectId/tasks", verifyToken, tasks.getAllTasks); //CZŁONEK ZESPOŁU

router.get("/tasks/:id", verifyToken, tasks.getTaskById); //CZŁONEK ZESPOŁU

router.patch("/tasks/:id", verifyToken, tasks.editTask); //CZŁONEK ZESPOŁU + CZŁONEK PROJEKTU + CZŁONEK DANEGO ZADANIA / NO CHYBA ŻE JEST TEAM LEADEREM XD, TO WYSTARCZY CZŁONEK ZESPOLU

router.delete("/tasks/:id", verifyToken, tasks.deleteTask); //CZŁONEK ZESPOŁU + CZŁONEK PROJEKTU + CZŁONEK DANEGO ZADANIA / NO CHYBA ZE JEST TEAM LEADEREM XD, TO WYSTARCZY CZŁONEK ZESPOŁU

router.get("/tasks/:id/comments", verifyToken, tasks.getComments); //probably niepotrzebne bo w getTaskById możesz mieć już to zrobione chyba

module.exports = router;
