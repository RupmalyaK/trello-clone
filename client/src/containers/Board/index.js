import React, { useEffect, useState } from "react";
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
const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: ${(props) => props.backgroundColor};

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
      background: ${({ theme, isDraggingOver }) =>
        !isDraggingOver ? theme.background["board-category"] : "orange"};
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
  const { currentBoard } = useSelector((state) => state.boards);
  const [tasksIds, setTaskIds] = useState(null);
  const [isChangingName, setIsChangingname] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isCreatingTDCard, setIsCreatingTDCard] = useState(false);
  const [isCreatingIDCard,setIsCreatingIDCard] = useState(false);
  const [isCreatingTBRCard,setIsCreatingTBRCard] = useState(false);
  const [isCreatingFCard,setIsCreatingFCard] = useState(false);

  
  const {id:userId} = useSelector(state => state.user);
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
    dispatch(getCurrentBoard(boardid));
  }, []);

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
    ///sdas
    const task = tasks[sourceCategory].splice(sourceIndex, sourceIndex + 1);
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
    const task = temp[sourceCategory].splice(sourceIndex, sourceIndex + 1);
    temp[destinationCategory].splice(destinationIndex, 0, task[0]);
    dispatch(updateBoard(boardid, { tasks: temp }));
  };
  const handleCreateTask = (name,colorIndex,category) => {
    if(!name)
      {
        return;
      }
    dispatch(createTask({name,userId,boardId:boardid,description:"",colorIndex,category}));
    switch(category)
      {
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
    
  }
  const showTasks = (tasks) => {
    const TaskComponents = tasks.map((task, index) => (
      <Task index={index} {...task} />
    ));
    return TaskComponents;
  };

  const showCategory = (categoryIndex) => {
    const CategoryComponents = categoryIndex.map((category) => {
      switch (categories[category]) {
        case "toDo":
          return (
            <Droppable
              droppableId="toDoTasks"
              type="category"
              style={{ position: "relative" }}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">To Do</div>
                  {showTasks(currentBoard.toDoTasks)}
                  {!isCreatingTDCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => setIsCreatingTDCard(true)}
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
            <Droppable droppableId="inDevelopmentTasks" type="category">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">In Development</div>
                  {showTasks(currentBoard.inDevelopmentTasks)}
                  {!isCreatingIDCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => setIsCreatingIDCard(true)}
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
            <Droppable droppableId="toBeReviewedTasks" type="category">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">To Be Reviewed</div>
                  {showTasks(currentBoard.toBeReviewedTasks)}
                  {!isCreatingTBRCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => setIsCreatingTBRCard(true)}
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
            <Droppable droppableId="finishedTasks" type="category">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                  {...provided.droppableProps}
                  className="category mr-4"
                >
                  <div className="category-title">Finished</div>
                  {showTasks(currentBoard.finishedTasks)}
                  {!isCreatingFCard && (
                    <button
                      className="add-card-button"
                      onClick={(e) => setIsCreatingFCard(true)}
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
    console.log(a);
    if (!a.source || !a.destination) {
      return;
    }
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
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    dispatch(updateBoard(boardid, { name: nameInput }));
                    setIsChangingname(false);
                  }
                }}
              />
              <div className="send-icon-container">
                <SendIcon
                  onClick={(e) => {
                    dispatch(updateBoard(boardid, { name: nameInput }));
                    setIsChangingname(false);
                  }}
                />
              </div>
            </div>
          ) : (
            currentBoard.name
          )}
        </span>
        <Icon className="mr-2">
          <CreateIcon onClick={(e) => setIsChangingname(!isChangingName)} />
        </Icon>
        <Icon>
          {currentBoard && !currentBoard.starred ? (
            <StarBorderIcon
              onClick={(e) =>
                dispatch(
                  updateBoard(boardid, { starred: true, isChangingStar: true })
                )
              }
            />
          ) : (
            <StarIcon
              onClick={(e) =>
                dispatch(
                  updateBoard(boardid, { starred: false, isChangingStar: true })
                )
              }
            />
          )}
        </Icon>
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
