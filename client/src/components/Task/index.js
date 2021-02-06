import React, { useState } from "react";
import styled from "styled-components";
import { colorArr } from "../../utils/constants";
import { ClearAll as DescriptionIcon } from "@material-ui/icons/";

import { Draggable } from "react-beautiful-dnd";

import TaskDetailModal from "../TaskDetailModal";
import { useDispatch } from "react-redux";
import { setCurrentTask } from "../../store/actions/boardAction.js";
import UserIconContainer from "../UserIcon";
const Container = styled.div`
  width: 100%;
  height: 150px;
  background: ${(props) => props.theme.background["board-category-task"]};
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 3px;
  color:${props => props.theme.text.task};
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  cursor: pointer;
  .description-icon-container{
    color:${props => props.theme.icon.task};

  }
  .users {
    display: flex;

    width: 100%;
  }
  .name {
    font-size: 1.2rem;
  }
`;

const ColorIcon = styled.div`
  width: 20%;
  height: 10px;
  background: ${(props) => props.backgroundColor};
  border-radius: 30px;
  border: 1px solid ${(props) => props.backgroundColor};
`;

const Task = ({ name, _id, users, index, colorIndex, description }) => {
  const [isShowingTask, setIsShowingTask] = useState(false);
  const dispatch = useDispatch();
  const showUsers = (users) => {
    if (!users) {
      return;
    }
    const taskUsers = users;
    let UserIconComponents = taskUsers.map((user,index) => (
      <UserIconContainer
        className="mr-3"
        backgroundColor={colorArr[user.colorIndex]}
        userName={user.userName}
        key={index}
      >
        {user.shortName.toUpperCase()}
      </UserIconContainer>
    ));
    const totalUsers = UserIconComponents.length;
    if (UserIconComponents.length > 3) {
      UserIconComponents = UserIconComponents.slice(0, 3);
    }

    return <>{UserIconComponents} {totalUsers > 3 && <span >{totalUsers-3} more users..</span>} </>;
  };
  return (
    <>
      <TaskDetailModal
        show={isShowingTask}
        onHide={() => setIsShowingTask(false)}
      />
      <Draggable draggableId={_id} index={index} key={_id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-3"
            onClick={(e) => {
              dispatch(
                setCurrentTask({ name, _id, colorIndex, description, users })
              );
              setIsShowingTask(true);
            }}
          >
            <Container>
              {colorIndex !== -1 && (
                <ColorIcon backgroundColor={colorArr[colorIndex]} />
              )}
              <span className="name">{name}</span>
              <div className="description-icon-container">
                <DescriptionIcon />
              </div>
              <div className="users">{showUsers(users)}</div>
            </Container>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Task;
