const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    isDone: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: String,
      required: true
    }
  }
  // { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
