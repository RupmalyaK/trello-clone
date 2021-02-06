import * as actionTypes from "../actions/actionTypes.js";
import {boardUsers} from "../../utils/func";
import { CollectionsBookmarkOutlined } from "@material-ui/icons";
const INITIAL_STATE = {
  boards: null,
  currentBoard: null,
  isLoading: false,
  currentTask:{},
  isSearchingUsers:false,
  searchedUsers:null,
};

const boardReducer = (state = INITIAL_STATE, action) => {

  const { type, payLoad } = action;
  switch (type) {
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: true };
    case actionTypes.SET_BOARDS:{
      const boards = payLoad.map(board => {
        board.users = boardUsers(board.users);
       
        return board;
      });
      return { ...state, boards, isLoading: false };}

    case actionTypes.SET_CURRENT_BOARD:{
      const users = boardUsers(payLoad.users);
      payLoad.users = users; 
      const board = {...payLoad};

      board.toDoTasks = board.toDoTasks.map(task => {
        task.users = task.users.map(user => {
        for(let i = 0; i < board.users.length; i++)
          {
            if(user._id === board.users[i]._id)
              {
                return board.users[i];
              }
          }
        });
        console.log(task);
        return task;
      });

      board.inDevelopmentTasks = board.inDevelopmentTasks.map(task => {
        task.users = task.users.map(user => {
        for(let i = 0; i < board.users.length; i++)
          {
            if(user._id === board.users[i]._id)
              {
                return board.users[i];
              }
          }
        });
        console.log(task);
        return task;
      });

      board.toBeReviewedTasks = board.toBeReviewedTasks.map(task => {
        task.users = task.users.map(user => {
        for(let i = 0; i < board.users.length; i++)
          {
            if(user._id === board.users[i]._id)
              {
                return board.users[i];
              }
          }
        });
        console.log(task);
        return task;
      });

      board.finishedTasks = board.finishedTasks.map(task => {
        task.users = task.users.map(user => {
        for(let i = 0; i < board.users.length; i++)
          {
            if(user._id === board.users[i]._id)
              {
                return board.users[i];
              }
          }
        });
     
        return task;
      });
      return { ...state, currentBoard: board, isLoading: false };}
    case actionTypes.SET_TASKS: {
      const {
        toDoTasks,
        inDevelopmentTasks,
        toBeReviewedTasks,
        finishedTasks,
      } = payLoad;
      const currentBoard = {
        ...state.currentBoard,
        toDoTasks,
        inDevelopmentTasks,
        toBeReviewedTasks,
        finishedTasks,
      };
      return { ...state, currentBoard };
    }
    case actionTypes.SET_CURRENT_TASK:
      return {...state,currentTask:payLoad};

    default:
      return state;
  }
};

export default boardReducer;
