import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentBoard,
  updateAndGetBoard as updateBoard,
  setTasks,
  createTask,
} from "../../store/actions/boardAction.js";
import { useParams } from "react-router-dom";
import { colorArr, categories } from "../../utils/constants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../../components/Task";
import {
  Create as CreateIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  Send as SendIcon,
  Add as AddIcon,
} from "@material-ui/icons/";
import AddCard from "../../components/AddCard";
import Icon from "../../components/Icon";
import Invite from "../../components/Invite";
import { boardUsers } from "../../utils/func.js";
import { useHistory } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import UserIconContainer from "../../components/UserIcon";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${(props) =>
    props.currentTheme === "light" ? props.backgroundColor : "#1b1b2f"};
  overflow-y: scroll;
  .top-content {
    margin-top: 40px;
    justify-content: flex-start;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    color: white;
    padding: 30px 30px 0px 30px;
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
  .add-card-button {
    height: 50px;
    bottom: 0%;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    cursor: pointer;
    border: 0px;
    border-radius: 3px;
    position: absolute;
    color: #6b778c;
    margin-left: -30px;
    padding-left: 30px;
    boarder-radius: 3px;
    &:focus {
      outline: none;
    }
    &:hover {
      background: hsla(0, 0%, 100%, 0.8);
    }
  }
  .content {
    padding: 30px 30px 0px 30px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .category {
      width: 25%;
      min-width: 300px;
      background: ${({ theme, isDraggingOver }) =>
        !isDraggingOver ? theme.background["board-category"] : "orange"};
      color: ${(props) => props.theme.text.category};
      position: relative;
      padding: 30px 30px 50px 30px;
      .category-title {
        font-size: 1.2rem;
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }
`;

const Board = (props) => {
  const { boardid } = useParams();
  const dispatch = useDispatch();
  const { currentBoard, isLoading } = useSelector((state) => state.boards);
  const [tasksIds, setTaskIds] = useState(null);
  const [isChangingName, setIsChangingname] = useState(false);
  const [nameInput, setNameInput] = useState(
    currentBoard ? currentBoard.name : ""
  );
  const history = useHistory();
  const [isCreatingTDCard, setIsCreatingTDCard] = useState(false);
  const [isCreatingIDCard, setIsCreatingIDCard] = useState(false);
  const [isCreatingTBRCard, setIsCreatingTBRCard] = useState(false);
  const [isCreatingFCard, setIsCreatingFCard] = useState(false);
  const boardNameInputRef = useRef(null);
  const [isShowingInvite, setIsShowingInvite] = useState(false);
  const { id: userId } = useSelector((state) => state.user);
  const { currentTheme } = useSelector((state) => state.system);
  console.log(tasksIds);
  useEffect(() => {
    if (isChangingName) {
      boardNameInputRef.current.focus();
    }
  }, [isChangingName]);

  useEffect(() => {
    if (currentBoard) {
      const tasks = {
        toDoTasks: [],
        inDevelopmentTasks: [],
        toBeReviewedTasks: [],
        finishedTasks: [],
      };
      currentBoard.toDoTasks.forEach((task) => tasks.toDoTasks.push(task._id));
         currentBoard.inDevelopmentTasks.forEach((task) =>
        tasks.inDevelopmentTasks.push(task._id)
      );
      currentBoard.toBeReviewedTasks.forEach((task) =>
        tasks.toBeReviewedTasks.push(task._id)
      );
      currentBoard.finishedTasks.forEach((task) =>
        tasks.finishedTasks.push(task._id)
      );
      setTaskIds(tasks);
    }
  }, [currentBoard]);
 
  useEffect(() => {
    dispatch(getCurrentBoard({ boardId: boardid }, true));
  }, [boardid]);

  if (!userId) {
    history.push("/signin");
    return <></>;
  }
  if (isLoading) {
    return <LoadingScreen />;
  }
  console.log(tasksIds);
  const showUsers = () => {
    if (!currentBoard) {
      return;
    }
    const UserComponenets = currentBoard.users.map(
      (user, index) => (
        <UserIconContainer
          backgroundColor={colorArr[user.colorIndex]}
          className="ml-3"
          userName={user.userName}
          style={{
            border: "5px solid black",
            padding: "10px",
            width: "55px",
            height: "auto",
          }}
          key={index}
        >
          {user.shortName.toUpperCase()}
        </UserIconContainer>
      )
    );
    return UserComponenets;
  };

  const moveActualTasks = (
    sourceCategory,
    sourceIndex,
    destinationCategory,
    destinationIndex
  ) => {
    const {
      toDoTasks,
      inDevelopmentTasks,
      toBeReviewedTasks,
      finishedTasks,
    } = currentBoard;
    const tasks = {
      toDoTasks,
      inDevelopmentTasks,
      toBeReviewedTasks,
      finishedTasks,
    };
    const task = tasks[sourceCategory].splice(sourceIndex, 1);
    tasks[destinationCategory].splice(destinationIndex, 0, task[0]);
    dispatch(setTasks(tasks));
  };

  const moveTask = (
    sourceCategory,
    sourceIndex,
    destinationCategory,
    destinationIndex
  ) => {
    if (!sourceCategory || !destinationCategory) {
      return;
    }
    if (destinationIndex === null) {
      return;
    }
    moveActualTasks(
      sourceCategory,
      sourceIndex,
      destinationCategory,
      destinationIndex
    );
    const temp = { ...tasksIds };
    //const temp = {toDoTasks:[...tasksIds.toDoTasks],inDevelopmentTasks:[...tasksIds.inDevelopmentTasks]};
    const task = temp[sourceCategory].splice(sourceIndex, 1);
    temp[destinationCategory].splice(destinationIndex, 0, task[0]);
  
  dispatch(updateBoard(boardid, { tasks: temp }, false, true));
   setTaskIds(temp);
  };
 
  const handleCreateTask = (name, colorIndex, category) => {
    if (!name) {
      return;
    }
    dispatch(
      createTask({
        name,
        userId,
        boardId: boardid,
        description: "",
        colorIndex,
        category,
      })
    );

    switch (category) {
      case "toDo":
        setIsCreatingTDCard(false);
        return;
      case "inDevelopment":
        setIsCreatingIDCard(false);
        return;
      case "toBeReviewed":
        setIsCreatingTBRCard(false);
        return;
      case "finished":
        setIsCreatingFCard(false);
    }
  };
  const showTasks = (tasks) => {
    const TaskComponents = tasks.map((task, index) => (
      <Task index={index} {...task} key={index} />
    ));
    return TaskComponents;
  };

  const showCategory = (categoryIndex) => {
    if (!categoryIndex) {
      return;
    }
    const CategoryComponents = categoryIndex.map((category, index) => {
      switch (categories[category]) {
        case "toDo":
          return (
            <Droppable
              droppableId="toDoTasks"
              type="category"
              style={{ position: "relative" }}
              key={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  key={index}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">To Do</div>
                  {showTasks(currentBoard.toDoTasks)}
                  {!isCreatingTDCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => {
                        setIsCreatingIDCard(false);
                        setIsCreatingTDCard(true);
                        setIsCreatingTBRCard(false);
                        setIsCreatingFCard(false);
                      }}
                    >
                      <AddIcon
                        className="mr-3"
                        style={{ fontSize: "2.5rem" }}
                      />{" "}
                      Add another card
                    </button>
                  )}
                  {isCreatingTDCard && (
                    <AddCard
                      handleClose={(e) => setIsCreatingTDCard(false)}
                      handleSubmit={handleCreateTask}
                      category="toDo"
                    />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        case "inDevelopment":
          return (
            <Droppable
              key={index}
              droppableId="inDevelopmentTasks"
              type="category"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  key={index}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">In Development</div>
                  {showTasks(currentBoard.inDevelopmentTasks)}
                  {!isCreatingIDCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => {
                        setIsCreatingIDCard(true);
                        setIsCreatingTDCard(false);
                        setIsCreatingTBRCard(false);
                        setIsCreatingFCard(false);
                      }}
                    >
                      <AddIcon
                        className="mr-3"
                        style={{ fontSize: "2.5rem" }}
                      />{" "}
                      Add another card
                    </button>
                  )}
                  {isCreatingIDCard && (
                    <AddCard
                      handleClose={(e) => setIsCreatingIDCard(false)}
                      handleSubmit={handleCreateTask}
                      category="inDevelopment"
                    />
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        case "toBeReviewed":
          return (
            <Droppable
              key={index}
              droppableId="toBeReviewedTasks"
              type="category"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  key={index}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">To Be Reviewed</div>
                  {showTasks(currentBoard.toBeReviewedTasks)}
                  {!isCreatingTBRCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => {
                        setIsCreatingIDCard(false);
                        setIsCreatingTDCard(false);
                        setIsCreatingTBRCard(true);
                        setIsCreatingFCard(false);
                      }}
                    >
                      <AddIcon
                        className="mr-3"
                        style={{ fontSize: "2.5rem" }}
                      />{" "}
                      Add another card
                    </button>
                  )}
                  {isCreatingTBRCard && (
                    <AddCard
                      handleClose={(e) => setIsCreatingTBRCard(false)}
                      handleSubmit={handleCreateTask}
                      category="toBeReviewed"
                    />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        case "finished":
          return (
            <Droppable key={index} droppableId="finishedTasks" type="category">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  key={index}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">Finished</div>
                  {showTasks(currentBoard.finishedTasks)}
                  {!isCreatingFCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => {
                        setIsCreatingIDCard(false);
                        setIsCreatingTDCard(false);
                        setIsCreatingTBRCard(false);
                        setIsCreatingFCard(true);
                      }}
                    >
                      <AddIcon
                        className="mr-3"
                        style={{ fontSize: "2.5rem" }}
                      />{" "}
                      Add another card
                    </button>
                  )}
                  {isCreatingFCard && (
                    <AddCard
                      handleClose={(e) => setIsCreatingFCard(false)}
                      handleSubmit={handleCreateTask}
                      category="finished"
                    />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
      }
    });
    return CategoryComponents;
  };

  const handleDragEnd = (a) => {
   
    if (!a.source || !a.destination) {
      return;
    }
  //  console.log("EVEN BEFORE", tasksIds);
    moveTask(
      a.source.droppableId,
      a.source.index,
      a.destination.droppableId,
      a.destination.index
    );
  };

  if (!currentBoard) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      backgroundColor={currentBoard ? colorArr[currentBoard.colorIndex] : ""}
      currentTheme={currentTheme}
    >
      <Header />
      <div className="top-content">
        <span className="mr-4">
          {isChangingName ? (
            <div className="name-input-container">
              <input
                className="name-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                ref={boardNameInputRef}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    dispatch(updateBoard(boardid, { name: nameInput }, true));
                    setIsChangingname(false);
                  }
                }}
              />
              <div
                className="send-icon-container"
                onClick={(e) => {
                  dispatch(updateBoard(boardid, { name: nameInput }, true));
                  setIsChangingname(false);
                }}
              >
                <SendIcon />
              </div>
            </div>
          ) : (
            currentBoard.name
          )}
        </span>
        <Icon
          className="mr-2"
          onClick={(e) => setIsChangingname(!isChangingName)}
        >
          <CreateIcon />
        </Icon>
        <Icon
          onClick={(e) =>
            dispatch(
              updateBoard(
                boardid,
                {
                  starred: !currentBoard.starred,
                  isChangingStar: true,
                },
                true
              )
            )
          }
        >
          {currentBoard && !currentBoard.starred ? (
            <StarBorderIcon />
          ) : (
            <StarIcon />
          )}
        </Icon>
        <div
          className="invite-container"
          style={{ position: "relative" }}
          className="ml-2"
        >
          <Icon
            style={{
              width: "auto",
              padding: "10px",
              fontSize: "1.2rem",
              position: "relative",
            }}
            onClick={(e) => setIsShowingInvite(true)}
          >
            <span>Invite</span>
          </Icon>
          {isShowingInvite && (
            <Invite handleClose={(e) => setIsShowingInvite(false)} />
          )}
        </div>
        {showUsers()}
      </div>
      <div className="content">
        <DragDropContext onDragEnd={handleDragEnd}>
          {showCategory(currentBoard ? currentBoard.categoryIndex : [])}
        </DragDropContext>
      </div>
    </Container>
  );
};

export default Board;
