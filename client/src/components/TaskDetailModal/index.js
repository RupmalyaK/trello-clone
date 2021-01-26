import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { boardUsers } from "../../utils/func.js";
import "./style.css";
import { colorArr } from "../../utils/constants.js";
import Icon from "../Icon";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import { updateTask, deleteTask } from "../../store/actions/boardAction.js";
import Swal from "sweetalert2";
import Button from "../Button";
const Container = styled(Modal)`
  .modal-body {
    display: flex;
    height: 500px;
    background: white;
    flex-direction: column;
    width: 700px;
    margin-top: 100px;
    border-radius: 3px;
    padding:0px;
    background:#f4f5f7;

  }
  .tdm-header{
    background:${(props) => props.backgroundColor};
    display:flex;
    justify-content:flex-start;
    align-items:flex-start;
    flex-start;
    color:white;
    padding:20px;
    border-radius:3px;
  }
  .heading {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  .members {
    display: flex;
    flex-direction: column;
    padding:10px;
    height:200px;
  }
  .user-icons {
    display: flex;
    padding: 5px;
  }
  .description{
    padding:10px;
    font-size:1.2rem;
  }
  .name-input-container {
    background: white;
    border-radius: 3px;
    position: relative;
  }
  .send-icon-container {
    position: absolute;
    right: 3%;
    top: 2%;
    color: grey;
  }
  .name-input {
    background: none;
    border: 0px;
    &:focus {
      outline: none;
    }
  }
  }
  .desc-edit-icon{
    background:rgba(0,0,0,0.3);
    margin-left:10px;
    color:black;
    &:hover{
      background:rgba(0,0,0,0.6);
    }
  }
  .description{
    display:flex;
    flex-direction:column;
  }
  .description-heading{

    display:flex;
    align-items:center;
    justify-content:flex-start;
  }

  .description-text{
    margin-top:20px;
  }
  .desc-text{
    height:180px;
    width:100%;
    margin-top:10px;
    &:focus{
      border:0px;
      outline-color:blue;
    }
    border-radius:3px;
    
  }
  .desc-change-button{
    align-self:flex-start;
    width:auto !important;
    margin-top:10px;
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
const TaskDetail = ({ onHide, ...props }) => {
  const [updatingName, setUpdatingName] = useState(false);
  const dispatch = useDispatch();
  const [updatingDesc, setUpdatingDesc] = useState(false);
  const currentTask = useSelector((state) => state.boards.currentTask);
  const { currentBoard } = useSelector((state) => state.boards);
  const { id: userId } = useSelector((state) => state.user);
  const nameInputRef = useRef(null);
  const descInputRef = useRef(null);
  const [descInput, setDescInput] = useState(
    currentTask ? currentTask.description : ""
  );

  const [nameInput, setNameInput] = useState(
    currentTask ? currentTask.name : ""
  );

  useEffect(() => {
    if (currentTask) {
      setNameInput(currentTask.name);
      setDescInput(currentTask.description);
    }
  }, [currentTask]);

  useEffect(() =>{
    updatingName && nameInputRef.current && nameInputRef.current.focus();
    updatingDesc && descInputRef.current && descInputRef.current.focus();
  },[updatingName,updatingDesc])

  const { name, description, users, colorIndex, _id } = currentTask || {};
  const showUsers = () => {
    const shortNamedUsers = boardUsers(users);

    const UserIconComponenets = shortNamedUsers.map((user) => (
      <UserIconContainer backgroundColor={colorArr[user.colorIndex]}>
        {user.shortName.toUpperCase()}
      </UserIconContainer>
    ));
    return UserIconComponenets;
  };

  return (
    <Container
      {...props}
      contentClassName="tdm-content"
      backgroundColor={colorIndex === -1 ? "black" : colorArr[colorIndex]}
      onHide={onHide}
    >
      <div className="modal-body">
        <div className="tdm-header">
          <span className="heading" style={{ marginRight: "20px" }}>
            {updatingName ? (
              <div className="name-input-container">
                <input
                  className="name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  ref={nameInputRef}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      dispatch(
                        updateTask({
                          name: nameInput,
                          taskId: _id,
                          boardId: currentBoard._id,
                          userId,
                        })
                      );
                      setUpdatingName(false);
                    }
                  }}
                />
                <div className="send-icon-container">
                  <SendIcon
                    onClick={(e) => {
                      dispatch(
                        updateTask({
                          name: nameInput,
                          taskId: _id,
                          boardId: currentBoard._id,
                          userId,
                        })
                      );
                      setUpdatingName(false);
                    }}
                  />
                </div>
              </div>
            ) : (
              name
            )}
          </span>
          <Icon
            className="mr-3"
            onClick={(e) => setUpdatingName(!updatingName)}
          >
            {updatingName ? <CloseIcon /> : <EditIcon />}
          </Icon>
          <Icon  onClick={async (e) => {
                const result = await Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                });
                if (!result.isConfirmed) {
                  return;
                }

                dispatch(
                  deleteTask({ taskId: _id, boardId: currentBoard._id, userId })
                );
                onHide();
              }}>
            <DeleteIcon
             
            />
          </Icon>
        </div>
        <div className="members">
          <div className="members-heading">Members</div>
          <div className="user-icons">{showUsers()}</div>
        </div>
        <div className="description">
          <span className="description-heading">
            Description
            <Icon
              className="desc-edit-icon"
              onClick={(e) => setUpdatingDesc(!updatingDesc)}
            >
              {updatingDesc ? <CloseIcon /> : <EditIcon />}
            </Icon>
          </span>
          {updatingDesc ? (
            <textArea
              type="text"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              className="desc-text"
              placeholder={description}
              ref={descInputRef}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  dispatch(
                    updateTask({
                      description: descInput,
                      taskId: _id,
                      boardId: currentBoard._id,
                      userId,
                    })
                  );
                  setUpdatingDesc(false);
                }
              }}
            />
          ) : (
            <span className="description-text">
              {description ? description : "No description."}
            </span>
          )}
          {updatingDesc && (
            <Button
              onClick={(e) => {
                dispatch(
                  updateTask({
                    description: descInput,
                    taskId: _id,
                    boardId: currentBoard._id,
                    userId,
                  })
                );
                setUpdatingDesc(false);
              }}
              className="desc-change-button"
            >
              Change
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default TaskDetail;

/**
 * Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  }
 */
