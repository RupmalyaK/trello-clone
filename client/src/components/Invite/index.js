import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getUsersByUserName } from "../../store/actions/userAction.js";
import { addUserBoard } from "../../store/actions/boardAction.js";
import { colorArr } from "../../utils/constants";
import { Close } from "@material-ui/icons";
const Container = styled.div`
  width: 300px;
  height: 200px;
  color:white !important;
  background: rgb(255, 255, 255);
  position: absolute;
  z-index: 70;
  top: 90%;
  left: 30%;
  box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25),
    0 0 0 1px rgba(9, 30, 66, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  color:${props => props.theme.text.task} !important;
  overflow-y:scroll;
  overflow-x:hidden;
  background:${props => props.theme.background.dropdown};
  .invite-heading {
   
    font-size: 1.2rem;
    padding: 10px;
  
  }
  .invite-name-input {
    box-shadow: inset 0 0 0 2px ${props => props.theme.button.signUp};
    border: 0px;
    background: #fafbfc;
    font-size: 1rem;
    width: 98%;
    height: 30px;
    padding: 5px;
    margin-top:10px;
    background:${({theme,currentTheme}) => currentTheme === "dark" ? theme.button.signUp : "white"};
    &:hover {
      background:${({theme,currentTheme}) => currentTheme === "dark" ? theme.button["signUp-hover"] : "#b2b2b2"};
    }
 
    &:focus {
      border: 0px;
      outline: none;
      background:${({theme,currentTheme}) => currentTheme === "dark" ? theme.background["invite-input-hover"] : "#b2b2b2"};
     
      border:none;
    }
  }
  .users {
    display: flex;
    flex-direction: column;

    width: 100%;
  }
  .user {
    display: flex;
    justify-content: space-between;
    
    padding: 10px;
    align-items: center;
    cursor: pointer;
    &:hover{
      background:#999999;
    }
  }
`;
const Line = styled.div`
  width: 100%;
  height: 10px;
  border-top: 1px solid ${(props) => props.theme.border.line};
`;

const UserIconContainer = styled.div`
  background: ${(props) => props.backgroundColor};
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: ${(props) => props.theme.text["board-box"]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseIcon = styled(Close)`
  position: absolute;
  right: 5%;
  top: 3%;
  cursor: pointer;
`;
const Invite = ({ handleClose }) => {
  const { searchedUsers, isSearchingUsers, id: userId } = useSelector(
    (state) => state.user
  );
  const containerRef = useRef(null);
  const { currentBoard } = useSelector((state) => state.boards);
  const [userNameInput, setUserNameInput] = useState("");
  const dispatch = useDispatch();
  const {currentTheme} = useSelector(state => state.system);
  const handleChange = (e) => {
    setUserNameInput(e.target.value);
    dispatch(getUsersByUserName(e.target.value));
  };

  const showSearchedUsers = () => {
    if (isSearchingUsers) {
      return "loading...";
    }
    if (!searchedUsers) {
      return <></>;
    }
    const SearchedUserComponents = searchedUsers.map((user) => (
      <div
        className="user"
        onClick={(e) => {
          dispatch(
            addUserBoard({
              boardId: currentBoard._id,
              userId,
              otherUserId: user._id,
            })
          );
        }}
      >
        <UserIconContainer backgroundColor={colorArr[user.colorIndex]}>
          {user.displayName.charAt(0).toUpperCase()}
        </UserIconContainer>
        <span>@{user.userName}</span>
      </div>
    ));
    return SearchedUserComponents;
  };
  useEffect(() => {
    dispatch(getUsersByUserName(""));
    const handleClickOutsideBox = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideBox);
    const handleUnmount = () => {
      document.removeEventListener("mousedown", handleClickOutsideBox);
    };
    return handleUnmount;
  }, []);
  return (
    <Container ref={containerRef} currentTheme={currentTheme}>
      <CloseIcon onClick={handleClose} />
      <span className="invite-heading">Invite to board</span>
      <Line />
      <input
        placeholder="search by username..."
        className="invite-name-input"
        value={userNameInput}
        onChange={handleChange}
      />
      <div className="users">{showSearchedUsers()}</div>
    </Container>
  );
};

export default Invite;
