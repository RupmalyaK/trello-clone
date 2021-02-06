import * as actionTypes from "./actionTypes.js";
import {
  getBoardsByUserId,
  postBoard,
  updateBoardById,
  getBoardById,
  addTaskInBoard,
  updateTaskById,
  getTaskById,
  deleteTaskById,
  addUserToBoard,
  addUserToTask
} from "../../api/boardsApi.js";
import { boardUsers } from "../../utils/func.js";

const createAction = (type, payLoad) => {
  return { type, payLoad };
};

export const getAllBoards = (userId) => {
  return async (dispatch) => {
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try {
      const boards = await getBoardsByUserId(userId);
      const boardsWithShortUsers = boards.map((board) => {
        const editedUsers = boardUsers(board.users);
        return { ...board, users: editedUsers };
      });
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

export const updateBoard = (
  id,
  { name, userId, colorIndex, tasks, isChangingStar, starred, categoryIndex }
) => {
  return async (dispatch,getState) => {
    const {id:userId} = getState().user;
  
    dispatch(createAction(actionTypes.SET_IS_LOADING));
    try {
      await updateBoardById(id, {
        name,
        colorIndex,
        tasks,
        starred,
        categoryIndex,
        isChangingStar,
        userId
      });
      dispatch(getAllBoards(userId));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getCurrentBoard = ({boardId},setIsLoading) => {
 
  return async (dispatch,getState) => {
    const {id:userId} = getState().user ;
    if(setIsLoading)
      {
        dispatch(createAction(actionTypes.SET_IS_LOADING));
      }
    
    try {
      const board = await getBoardById({boardId,userId});
      dispatch(createAction(actionTypes.SET_CURRENT_BOARD, board));
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateAndGetBoard = (
  id,
  { name, userId, colorIndex, tasks, isChangingStar, starred, categoryIndex },setIsLoading,shouldNotGet
) => {
  return async (dispatch,getState) => {
    const {id:userId} = getState().user;
    try {
     
      await updateBoardById(id, {
        name,
        colorIndex,
        tasks,
        starred,
        categoryIndex,
        isChangingStar,
        userId,
      });
      if(shouldNotGet)
        {  
          return;
        }
     
      dispatch(getCurrentBoard({boardId:id},setIsLoading));
    } catch (err) {
      console.log(err);
    }
  };
};

export const createTask = ({
  name,
  userId,
  boardId,
  description,
  colorIndex,
  category,
}) => {
  return async (dispatch) => {
    try {
      await addTaskInBoard({
        name,
        userId,
        boardId,
        description,
        colorIndex,
        category,
      });
      dispatch(getCurrentBoard({boardId:boardId},true));
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateTask = ({
  taskId,
  name,
  description,
  colorIndex,
  newUserId,
  userId,
  boardId,
}) => {
  return async (dispatch,getState )=> {
    try{
      const board = getState().boards.currentBoard;
      await updateTaskById({taskId,name,description,colorIndex,newUserId,userId,boardId});
      dispatch(getCurrentBoard({boardId:boardId}));
      const task = await getTaskById({boardId,userId,taskId});
      task.users = task.users.map(user => {
        for(let i = 0; i < board.users.length; i++)
          {
            if(user._id === board.users[i]._id)
              {
                return board.users[i];
              }
          }
      });
      dispatch(createAction(actionTypes.SET_CURRENT_TASK,task))
    }
    catch(err)
      {
        console.log(err);
      }

  }
};

export const deleteTask = ({boardId,userId,taskId}) => {
  return async dispatch => {

    try{
      await deleteTaskById({boardId,userId,taskId});
      dispatch(setCurrentTask(null));
      dispatch(getCurrentBoard({boardId:boardId}));
    }
  catch(err)
      {
        console.log(err);
      }
}};
export const setCurrentTask = (task) => {
  return createAction(actionTypes.SET_CURRENT_TASK, task);
};

export const addUserBoard = ({boardId,userId,otherUserId}) => {
  return async dispatch => {
    try{
    await addUserToBoard({boardId,userId,otherUserId});
    dispatch(getCurrentBoard({boardId:boardId},true)); }
    catch(err)
      {
        console.log(err);
      }
  }

}
export const addTaskUser  = ({boardId,userId,otherUserId,taskId}) => {
  return async (dispatch, getState )=> {
    try{
        const board = getState().boards.currentBoard;
        await addUserToTask({boardId,userId,otherUserId,taskId});
        const task = await getTaskById({boardId,userId,taskId});
        task.users = task.users.map(user => {
          for(let i = 0; i < board.users.length; i++)
            {
              if(user._id === board.users[i]._id)
                {
                  return board.users[i];
                }
            }
        });
        dispatch(createAction(actionTypes.SET_CURRENT_TASK,task));
        dispatch(getCurrentBoard({boardId}));
      }
    catch(err)
      {
        console.log(err);
      }
  }
}
export const setTasks = (tasks) => {
  return createAction(actionTypes.SET_TASKS, tasks);
};
