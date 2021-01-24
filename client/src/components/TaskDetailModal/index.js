import React from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import {boardUsers} from "../../utils/func.js"
import "./style.css";
import {colorArr} from "../../utils/constants.js";
const Container = styled(Modal)`
 

  .modal-body{
    display: flex;
    height: 500px;
    background:white;
    flex-direction:column;
    width:700px;
    margin-top:100px;
    padding:10px;
    border-radius:3px;
  }
  .heading{
      font-size:1.5rem;
      margin-bottom:20px;
  }
  .members{
      display:flex;
      flex-direction:column;
  }
  .user-icons{
      display:flex;
  }
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

//{name,description,users,colorIndex}
const TaskDetail = ({ ...props }) => {
  const currentTask = useSelector((state) => state.boards.currentTask);
  if (!currentTask) {
    return <></>;
  }
 
  const { name, description, users, colorIndex } = currentTask;
  const showUsers = () => {
    const shortNamedUsers = boardUsers(users);

    const UserIconComponenets = shortNamedUsers.map(user => (
        <UserIconContainer backgroundColor={colorArr[user.colorIndex]}>
            {user.shortName.toUpperCase()}
        </UserIconContainer>
    ))    
    return UserIconComponenets;
}
  return (
    <Container {...props} contentClassName="tdm-content">
      <div className="modal-body">
        <span className="heading">{name}</span>
        <div className="members">
          <span className="members-heading">Members</span>
          <div className="user-icons">
          {showUsers()}
          </div>
          
        </div>
        <div className="description">{description}</div>
      </div>
    </Container>
  );
};

export default TaskDetail;
