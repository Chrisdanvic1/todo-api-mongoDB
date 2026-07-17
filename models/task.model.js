import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dateForCompletion: {
      type: Date,
      required: false, // just for now i just want to create the schema
      validate: {
        validator: (value) => value > new Date(),
        message: "Completion date must be in the future ",
      },
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
