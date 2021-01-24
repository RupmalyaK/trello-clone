import * as actionTypes from "../actions/actionTypes.js";

const INITIAL_STATE = {
  boards: null,
  currentBoard: null,
  isLoading: false,
  currentTask:{},
};

const boardReducer = (state = INITIAL_STATE, action) => {
  const { type, payLoad } = action;
  switch (type) {
    case actionTypes.SET_IS_LOADING:
      return { ...state, isLoading: true };
    case actionTypes.SET_BOARDS:
      return { ...state, boards: payLoad, isLoading: false };

    case actionTypes.SET_CURRENT_BOARD:
      return { ...state, currentBoard: payLoad, isLoading: false };
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
