import BoardModel from "../model/BoardModel.js";
import TaskModel from "../model/TaskModel.js";
import { Router } from "express";
import { isAuthenticated } from "../controller/authController.js";
import { isUserinBoard } from "../controller/boardController.js";


const router = Router();

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const {
      name,
      userId,
      description,
      colorIndex,
      category,
      boardId,
    } = req.body;

    const task = new TaskModel({
      name,
      description,
      colorIndex,
      users: [userId],
    });
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
        throw new Error("no case found");
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

router.put("/", isAuthenticated, isUserinBoard, async (req, res, next) => {
  const {
    taskId,
    name,
    description,
    colorIndex,
    newUserId,
    userId,
    boardId,
  } = req.body;

  try {
   if (!req.userPresentInBoard) {
      throw new Error("User not present in board");
   }
    

    const task = await TaskModel.findById(taskId);

    if (name) {
   
      task.name = name;
    }
    if (description) {
      task.description = description;
    }
    if (colorIndex) {
      task.colorIndex = colorIndex;
    }
    if (newUserId) {
      task.users.push(newUserId);
    }
    await task.save();
   res.status(200).json({ operation: "success" });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

router.delete("/", isAuthenticated,isUserinBoard, async (req, res, next) => {
  const {taskId} = req.body;
  try{
    if (!req.userPresentInBoard) {
      throw new Error("User not present in board");
    }
    await TaskModel.deleteOne({_id:taskId});
    res.status(200).json({"operation":"success"});
  }
  catch(err)
    {
      console.log(err);
      res.status(500);
      res.error = err;
      next();
    
    }
});

router.get("/task", async(req, res, next) => {
  try{
const {userId,taskId,boardId} = req.query;

const board = await  BoardModel.findById(boardId);
let flag = false;
board.users.forEach(user => {
  if(user._id.toString() === userId)
  {
    flag = true;
  }
});
if(!flag)
  {
    throw new Error("User not present in board");
  }
  const task = await TaskModel.findById(taskId).populate({path:"users",model:"user"}).exec();
  res.status(200).json(task);
}
  catch(err)
    {
      console.log(err);
      res.status(500);
      res.error = err;
      next();
    }
});

router.put("/task/adduser",isAuthenticated,async(req, res, next) => {
  const { userId, boardId,taskId,otherUserId } = req.body;

  try{
  const board = await BoardModel.findById(boardId);
    let flags = [false,false];
    board.users.forEach((user) => {
      if (user._id.toString() === userId) {
        flags[0] = true;
        return;
      }
      if(otherUserId === user._id.toString())
        {
          flags[1] = true;
          return;
        }
    });
    if(!flags[0] || !flags[1] )
      {
        throw new Error("user not present in board");
      }
      const task = await TaskModel.findById(taskId);
      let flag = false;
      task.users.forEach(user => {
        if(user._id.toString() === otherUserId)
          {
           
            flag = true;
            return;
          }
      });
      if(flag)
        {
          throw new Error("User already in task");
        }

        task.users.push(otherUserId);
        await task.save();
        res.status(200).json({"operation":"success"});
  }catch(err)
    {
      console.log(err);
      res.status(500);
      res.error = err;
      next();
    }
})

export default router;
