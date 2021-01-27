import BoardModel from "../model/BoardModel.js";
import { Router } from "express";
import { isAuthenticated } from "../controller/authController.js";
import {isUserinBoard} from "../controller/boardController.js";

const router = new Router();

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { userId, name, colorIndex } = req.body;
    const board = new BoardModel({
      name,
      colorIndex,
      users: [userId],
    });
    const response = await board.save();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

router.get("/:userid", isAuthenticated, async (req, res, next) => {
  try {
    
    const { userid } = req.params;
    const boards = await BoardModel.find({})
      .populate({
        path: "users",
        model: "user",
      })
      .exec();
    const assignedBoards = [];
    boards.forEach((board) => {
      board.users.forEach((user) => {
        
        if (user._id.toString() === userid) {
          assignedBoards.push(board);
        }
      });
    });
    res.status(200).json(assignedBoards);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

router.get("/board/getboard", async (req, res, next) => {
  try {
    
    const { boardid,userid } = req.query;
    
    const board = await BoardModel.findById(boardid)
      .populate({
        path: "users",
        model: "user",
      })
      .populate({
        path: "toDoTasks",
        model: "task",
        populate:{
          path:"users",
          model:"user"
        }
      })
      .populate({
        path: "inDevelopmentTasks",
        model: "task",
        populate:{
          path:"users",
          model:"user"
        }
      })
      .populate({
        path: "toBeReviewedTasks",
        model: "task",
        populate:{
          path:"users",
          model:"user"
        }
      })
      .populate({
        path: "finishedTasks",
        model: "task",
        populate:{
          path:"users",
          model:"user"
        }
      })
      .exec();
    let flag = false;
    board.users.forEach(user => {
      if(user._id.toString() === userid)
        {
          flag = true;
        }
    })  
    if(!flag)
      {
        throw new Error("User not in board");
      }
    res.status(200).json(board);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

router.put("/board",isAuthenticated, isUserinBoard, async (req, res, next) => {
  try {
    const {
      boardId,
      name,
      colorIndex,
      tasks,
      starred,
      categoryIndex,
      isChangingStar,
    } = req.body;
   
    if(!req.userPresentInBoard)
      {
       
        throw new Error("User not present in board");
      }
   
    let board = await BoardModel.findById(boardId);
    if (name) {
      board.name = name;
    }
    if (colorIndex) {
      board.colorIndex = colorIndex;
    }
    if (isChangingStar) {
      board.starred = starred;
    }
    if (categoryIndex) {
      board.categoryIndex = categoryIndex;
    }
    if (tasks) {
      const {
        toDoTasks,
        inDevelopmentTasks,
        toBeReviewedTasks,
        finishedTasks,
      } = tasks;
      console.log(finishedTasks);
    
      board.toDoTasks = [...toDoTasks];
      board.inDevelopmentTasks = [...inDevelopmentTasks];
      board.toBeReviewedTasks = toBeReviewedTasks;
      board.finishedTasks = finishedTasks;
    }
   await board.save();
    res.status(200).json({ operation: "success" });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

router.put("/adduser",isAuthenticated, isUserinBoard, async(req, res, next) => {
  try{
    if(! req.userPresentInBoard)
      {
        throw new Error("User not in board");
      }
      const {boardId,otherUserId} = req.body;
    
      const board = await BoardModel.findById(boardId);
      let flag = false;
      board.users.forEach(user => {
        if(user._id.toString() === otherUserId)
          {
            flag = true;
          }
      });
      if(flag)
        {
          throw new Error("User already in board");
        }
        board.users.push(otherUserId);
        await board.save();
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

router.get("/", async (req, res) => {
  const boards = await BoardModel.find({});
  res.status(200).json(boards);
});
/*(async () => {
     await BoardModel.deleteMany({});
 })();*/

export default router;
