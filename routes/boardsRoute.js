import BoardModel from "../model/BoardModal.js";
import { Router } from "express";
import { isAuthenticated } from "../controller/authController.js";

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
        console.log(user._id, userid);
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

router.get("/board/:boardid", async (req, res, next) => {
  try {
    console.log("hello");
    const { boardid } = req.params;
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
    res.status(200).json(board);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.error = err;
    next();
  }
});

router.put("/board/:boardid", async (req, res, next) => {
  try {
    const {
      name,
      colorIndex,
      tasks,
      starred,
      categoryIndex,
      isChangingStar,
    } = req.body;
    const { boardid } = req.params;
    let board = await BoardModel.findById(boardid);
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

router.get("/", async (req, res) => {
  const boards = await BoardModel.find({});
  res.status(200).json(boards);
});
/*(async () => {
     await BoardModel.deleteMany({});
 })();*/

export default router;
