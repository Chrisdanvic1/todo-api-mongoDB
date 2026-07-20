// /* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import Task from "../models/task.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

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

    const token = jwt.sign({ userId: newTask[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        token,
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
        task: { tasks },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getById = (req, res, next) => {
  const taskId = req.params.id;
  const tasks = Task.findById({ taskId });

  if (!tasks) {
    const error = new Error("No task found");
    error.statusCode = 404;
    next(error);
  }

  res.status(200).json({
    success: true,
    message: "All tasks",
    data: {
      tasks,
    },
  });
};

export const update = (req, res, next) => {
  const { title, dateForCompletion, completed } = req.body;

  const taskId = req.params.id;
  const foundTask = Task.findById(taskId);

  if (!foundTask) {
    let error = new Error(`No task with ${taskId} was found`);
    error.statusCode = 404;
    next(error);
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
};
