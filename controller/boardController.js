import BoardModel from "../model/BoardModel.js";

export const isUserinBoard = async (req, res, next) => {
  const { userId, boardId } = req.body;
  
  try {
    const board = await BoardModel.findById(boardId);
    let flag = false;
    board.users.forEach((user) => {
      if (user._id.toString() === userId) {
        req.userPresentInBoard = true;
        next();
        flag = true;
        return;
      }
    });
    if(!flag)
      {
        throw new Error("user not present in board");
      }
   
  } catch (err) {
    console.log(err);
    req.userPresentInBoard = false;
    next();
  }
};
