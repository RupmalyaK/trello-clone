
import * as actionTypes from "../actions/actionTypes.js";

const INITIAL_STATE = {
boards:null,
currentBoard:null,
isFetchingBoard:false,
isCreatingBoard:false,
};


const boardReducer = (state = INITIAL_STATE, action) => {
    const {type,payLoad} = action;
    switch(type)
        {
            case actionTypes.SET_IS_FETCHING_BOARDS:
                return {...state ,isFetchingBoard:true};
            case actionTypes.SET_BOARDS:
                return {...state,boards:payLoad,isFetchingBoard:false,isCreatingBoard:false};    
            default:
                return state;
        }
}

export default boardReducer;