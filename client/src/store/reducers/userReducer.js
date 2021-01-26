import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
  prevDisplayName:"",
  displayName: "",
  email: "",
  id: "",
  colorIndex:-1,
  updatingDisplayName: false,
  signUpErrors:null,
  signInErrors:null,
  isSigningUp:false,
  userName:"",
  isSearchingUsers:false,
  searchedUsers:null

};

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payLoad } = action;

  switch (type) {
    case actionTypes.SET_USER_DETAIL: {
      const {
        displayName,
        email,
        createdAt,
        _id: id,
        colorIndex,
        userName
      } = payLoad;
      return {
        ...state,
        displayName,
        email,
        accountCreatedAt: createdAt,
        id,
        signUpErrors:null,
        colorIndex,
        userName
      };
    }
    case actionTypes.GET_USERS_BY_NAME:
      return { ...state, searchedUsers: payLoad, isSearchingUsers:false };
    case actionTypes.SET_UPDATING_DISPLAY_NAME:
      return { ...state, updatingDisplayName: true };
    case actionTypes.UNSET_UPDATING_DISPLAY_NAME:
      return { ...state, updatingDisplayName: false };
    case actionTypes.SET_SIGN_UP_ERRORS:
      return {...state,signUpErrors:payLoad,isSigningUp:false};
    case actionTypes.CLEAR_SIGN_UP_ERRORS:
      return {...state, signUpErrors:null,isSigningUp:false};
    case actionTypes.SET_SIGN_IN_ERRORS:
      return {...state,signInErrors:payLoad};
    case actionTypes.CLEAR_SIGN_IN_ERRORS:
      return {...state,signInErrors:null}
    case actionTypes.IS_SIGNING_UP:
      return {...state,isSigningUp:true};  
    case actionTypes.SET_IS_SEARCHING_USERS:
      return {...state, isSearchingUsers:true};
    case actionTypes.UNSET_IS_SEARCHING_USERS:
      return {...state,isSearchingUsers:false};   
    default:
      return state;
  }
};

export default userReducer;
