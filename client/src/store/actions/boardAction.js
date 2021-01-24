import * as actionTypes from "./actionTypes.js";
import { getBoardsByUserId, postBoard,updateBoardById,getBoardById,addTaskInBoard } from "../../api/boardsApi.js";
import { boardUsers } from "../../utils/func.js";

const createAction = (type, payLoad) => {
  return { type, payLoad };
};

export const getAllBoards = (userId) => {
  return async (dispatch) => {
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try {
      const boards = await getBoardsByUserId(userId);
      const boardsWithShortUsers = boards.map(board => {
        const editedUsers = boardUsers(board.users);
        return {...board,users:editedUsers}
      })
      dispatch(createAction(actionTypes.SET_BOARDS, boardsWithShortUsers));
    } catch (err) {
      console.log(err);
    }
  };
};

export const createBoard = (name, userId, colorIndex) => {
  return async (dispatch) => {
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try {
      await postBoard({ name, userId, colorIndex });
      dispatch(getAllBoards(userId));
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateBoard = (id, { name,userId, colorIndex, tasks,isChangingStar, starred, categoryIndex }) => {
  return async dispatch => {
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try{
    await updateBoardById(id,{ name, colorIndex, tasks, starred, categoryIndex,isChangingStar });
    dispatch(getAllBoards(userId));
    }
    catch(err)
      {
        console.log(err);
      }
  }
}


export const getCurrentBoard = (id) => {
  return async dispatch => {
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try{
    const board = await getBoardById(id);
    dispatch(createAction(actionTypes.SET_CURRENT_BOARD, board));
    }
    catch(err)
      {
        console.log(err);
      }

  }
}


export const updateAndGetBoard = (id, { name,userId, colorIndex, tasks,isChangingStar, starred, categoryIndex }) => {
  return async dispatch => {
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try{
    await updateBoardById(id,{ name, colorIndex, tasks, starred, categoryIndex,isChangingStar });
    dispatch(getCurrentBoard(id));
    }
    catch(err)
      {
        console.log(err);
      }
  }
}

export const createTask = ({name,userId,boardId,description,colorIndex,category}) => {
  return async(dispatch) => {
    try{
        await addTaskInBoard({name,userId,boardId,description,colorIndex,category});
        dispatch(getCurrentBoard(boardId));
      }
      catch(err)
        {
          console.log(err);
        }
  }
} 

export const setCurrentTask = (task) => {
    return createAction(actionTypes.SET_CURRENT_TASK ,task)
}

export const setTasks = (tasks) => {
  return createAction(actionTypes.SET_TASKS,tasks);
}