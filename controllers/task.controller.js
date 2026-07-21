// /* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import Task from "../models/task.model.js";

export const newTasks = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Logic to create a new task

    const { title, dateForCompletion } = req.body;

    if (
      !title ||
      typeof title !== "string" ||
      title.trim().length < 5 ||
      !dateForCompletion
    ) {
      return res.status(400).json({
        error:
          "Title must be at least 5 characters and dateForCompletion is required.",
      });
    }

    const newTask = await Task.create([{ title, dateForCompletion }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({
      success: true,
      message: "All tasks",
      data: {
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("Invalid task id");
    error.statusCode = 400;
    return next(error);
  }

  let id = await new mongoose.Types.ObjectId(taskId);
  // let id = res.json(taskId);
  const tasks = await Task.findById(id);

  if (!tasks) {
    const error = new Error("No task found");
    error.statusCode = 404;
    next(error);
  }

  res.status(200).json({
    success: true,
    message: `Task ${req.params.id} found successfully`,
    data: {
      tasks,
    },
  });
};

export const update = async (req, res, next) => {
  try {
    const { title, dateForCompletion, completed } = req.body;

    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      const error = new Error("Invalid task id");
      error.statusCode = 400;
      return next(error);
    }
    let id = new mongoose.Types.ObjectId(taskId);

    const foundTask = await Task.findById(id);
    if (!foundTask) {
      let error = new Error(`No task with ${taskId} was found`);
      error.statusCode = 404;
      return next(error);
    }
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 5) {
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
    await foundTask.save();
    res.status(200).json({
      message: "Task updated successfully",
      foundTask,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleted = async (req, res, next) => {
  const taskId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("Invalid task id");
    error.statusCode = 400;
    return next(error);
  }

  let id = new mongoose.Types.ObjectId(taskId);
  // let id = res.json(taskId);
  const tasks = await Task.findByIdAndDelete(id);
  if (!tasks) {
    const error = new Error("No task found");
    error.statusCode = 404;
    next(error);
  }

  res.status(200).json({
    Status: "Success",
    message: "Task deleted successfully",
  });
};

// PATCH
// ✔ validate ObjectId
// ✔ Task.findById()
// ✔ modify fields
// ✔ save()

// DELETE
// ✔ validate ObjectId
// ✔ Task.findByIdAndDelete()
