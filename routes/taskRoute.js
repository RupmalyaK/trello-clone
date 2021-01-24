import BoardModel from "../model/BoardModal.js";
import TaskModel from "../model/TaskModel.js";
import { Router } from "express";
import { isAuthenticated } from "../controller/authController.js";


const router = Router();

router.post("/",isAuthenticated, async (req, res, next) => {
  try {
    const {
      name,
      userId,
      description,
      colorIndex,
      category,
      boardId,
    } = req.body;
    
    const task = new TaskModel({ name, description, colorIndex, users:[userId] });
    const { _id } = await task.save();
    const board = await BoardModel.findById(boardId);

    switch (category) {
      case "toDo":
        board.toDoTasks.push(_id);
        break;
      case "inDevelopment":
        board.inDevelopmentTasks.push(_id);
        break;
      case "toBeReviewed":
        board.toBeReviewedTasks.push(_id);
        break;
      case "finished":
        board.finishedTasks.push(_id);
        break;
      default:
          throw new Error("no case found")     
    }
    const boardRes = await board.save();
    res.status(200).json(boardRes);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

//router.put("/",async (req, res, next))

export default router;
