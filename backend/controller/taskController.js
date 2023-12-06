const Task = require("../models/taskModel");
const mongoose = require("mongoose");

// get all tasks
const getTasks = async (req, res) => {
  try {
    const user_id = req.user._id;
    const tasks = await Task.find({ user_id });
    // const tasks = await Task.find({ user_id }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get a single task
const getTaskById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task found." });
  }

  const taskById = await Task.findById(id);

  if (!taskById) {
    return res.status(404).json({ error: "No such task found." });
  }

  res.status(200).json(taskById);
};

// create new task
const createTask = async (req, res) => {
  const { description, isEdit, isDone } = req.body;

  let emptyFields = [];
  if (!description) {
    emptyFields.push("description");
  }
  // if (!isEdit) {
  //   emptyFields.push("isEdit");
  // }
  // if (!isDone) {
  //   emptyFields.push("isDone");
  // }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please input all fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const task = await Task.create({ description, isEdit, isDone, user_id });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete an task
const deleteTaskById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task found." });
  }

  const deleteTaskById = await Task.findOneAndDelete({ _id: id });

  if (!deleteTaskById) {
    return res.status(400).json({ error: "No such task found." });
  }

  res.status(200).json(deleteTaskById);
};

// update an task
const updateTaskById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such task found." });
  }

  const updateTaskById = await Task.findOneAndUpdate(
    { _id: id },
    {
      ...req.body
    }
  );

  if (!updateTaskById) {
    return res.status(400).json({ error: "No such task found." });
  }

  res.status(200).json(updateTaskById);
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById
};
