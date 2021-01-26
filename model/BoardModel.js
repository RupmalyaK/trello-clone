import mongoose, { SchemaType } from "mongoose";

const Schema = mongoose.Schema;

const boardsSchema = new Schema({
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  name: {
    type: String,
    required: true,
    maxLength: 30,
    minlength: 3,
  },
  colorIndex: {
    type: Number,
    default: -1,
    max: 8,
    min:-1,
  },

  toDoTasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "task" }],
    default: [],
  },
  inDevelopmentTasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "task" }],
    default: [],
  },
  toBeReviewedTasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "task" }],
    default: [],
  },
  finishedTasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "task" }],
    default: [],
  },
  categoryIndex: {
    type: [Number],
    default: [0, 1, 2, 3],
  },
  starred: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("board", boardsSchema);
