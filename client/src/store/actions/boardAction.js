import * as actionTypes from "./actionTypes.js";
import { getBoardsByUserId, postBoard,updateBoardById } from "../../api/boardsApi.js";
import { boardUsers } from "../../utils/func.js";

const createAction = (type, payLoad) => {
  return { type, payLoad };
};

export const getAllBoards = (userId) => {
  return async (dispatch) => {
    dispatch(createAction(actionTypes.SET_IS_FETCHING_BOARDS));
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
    dispatch(createAction(actionTypes.SET_IS_CREATING_BOARD));
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
    dispatch(createAction(actionTypes.SET_IS_FETCHING_BOARDS));
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
