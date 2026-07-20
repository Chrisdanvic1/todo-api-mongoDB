import { Router } from "express";
import tasks from "../data/tasks.js";
import { getAll, getById, newTasks } from "../controllers/task.controller.js";

const taskRouter = Router();

// To get all tasks

taskRouter.get(
  "/",
  getAll,
  // (req, res) => {
  //   if (tasks.length === 0) {
  //     res.send({ message: "Tasks is empty" });
  //     return;
  //   }
  //   res.send({ title: "Get all Tasks", tasks });
  //
  // }
);

// To get task by id

taskRouter.get(
  "/:id",
  getById,
  //   (req, res) => {
  //   const taskId = Number(req.params.id);
  //   const foundTask = tasks.find((task) => task.id === taskId);

  //   if (!foundTask) {
  //     return res.status(404).send({
  //       error: `Task with id ${req.params.id} not found`,
  //     });
  //   }

  //   res.send({
  //     title: `Task ${req.params.id} retrieved successfully`,
  //     task: foundTask,
  //   });
  // }
);

// To send task to the tasks array

//   "/",
//   newTasks,
//    (req, res) => {
//   const { title, dateForCompletion } = req.body;

//   if (
//     !title ||
//     typeof title !== "string" ||
//     title.trim().length < 5 ||
//     !dateForCompletion
//   ) {
//     return res.status(400).send({
//       error:
//         "Title must be at least 5 characters and dateForCompletion is required.",
//     });
//   }

//   // const nextId = tasks.length + 1;
//   const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

//   const newTask = {
//     id: nextId,
//     title: title.trim(),
//     completed: false,
//     dateCreated: new Date().toISOString(),
//     dateForCompletion,
//   };

//   tasks.push(newTask);

//   return res.status(201).send({
//     message: "Task created successfully",
//     task: newTask,
//   });
// }
// );

taskRouter.post("/", newTasks);

// To edit a specific task

taskRouter.patch("/:id", (req, res) => {
  const { title, dateForCompletion, completed } = req.body;

  const taskId = Number(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskId);

  if (!foundTask) {
    res.status(404).send({ message: "Not found" });
    return;
  }
  if (title) {
    if (!title || typeof title !== "string" || title.trim().length < 5) {
      return res.status(400).send({
        error:
          "Title must be at least 5 characters and dateForCompletion is required.",
      });
    }
    foundTask.title = title.trim();
  }

  if (dateForCompletion) {
    foundTask.dateForCompletion = dateForCompletion;
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .send({ message: "completed must be true or false" });
    } else {
      foundTask.completed = completed;
    }
  }

  res.send({
    message: "Task updated successfully",
    foundTask,
  });
});

// to delete a task

taskRouter.delete("/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskId);

  if (!foundTask) {
    res.status(404).send({ message: "Not found" });
    return;
  }
  const index = tasks.findIndex((user) => user.id === taskId);

  if (index !== -1) {
    tasks.splice(index, 1);
  }
  res.status(200).send({ tasks, message: "Task deleted successfully" });
});

export default taskRouter;
