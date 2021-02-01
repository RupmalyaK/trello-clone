import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import "./style.css";
import { colorArr } from "../../utils/constants.js";
import { Check as CheckIcon, Close } from "@material-ui/icons";
import {useDispatch,useSelector} from "react-redux";
import {createBoard} from "../../store/actions/boardAction.js";
const Container = styled(Modal)``;

const ModalBody = styled.div`
  width: 600px;
  display: flex;
  padding: 5px;
`;

const MainContent = styled.div`
  width: 300px;
  height: 150px;
  display: flex;
  position:relative;
  flex-direction: column;

  .input-container {
    height: 80%;
    background: ${(props) => props.backgroundColor};
    padding: 10px;
    border-radius: 3px;
 
  }
`;

const SideContent = styled.div`
  width: 300px;
  height: 220px;
 
  margin-left: 10px;
  border-radius: 3px;
  background: ${(props) => props.theme.background["cbm-side"]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  color: ${(props) => props.theme.text["cbm-side"]};

  .side-content {
    display: flex;
    flex-wrap: wrap;
  
    .color-container {
      width: 33%;
      height: 56px;
      position: relative;

      .selected-color {
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        padding-bottom: 5px;
      }
    }
  }
`;

const Buttons = styled.div`
  width: 300px;
  height: 20%;
  margin-top: 5px;
`;

const Input = styled.input`
  background: ${(props) =>
    props.isActive ? props.theme.background["cbm-input"] : "none"};
  border: none;
  width: 90%;
  color: ${(props) => props.theme.text["cbm-input"]};
  font-weight: bolder;
  padding: 2px 10px;
  font-size: 16px;
  &:hover {
    background: ${(props) => props.theme.background["cbm-input-hover"]};
  }
  &:focus {
    border: none;
    outline: none;
  }
  ::placeholder {
    color: ${(props) => props.theme.text["cbm-input"]};
    opacity: 0.5;
  }
`;
const Line = styled.div`
  width: 100%;
  height: 10px;
  border-top: 1px solid ${(props) => props.theme.border.line};
`;
const CreateButton = styled.button`
  border-radius: 3px;
  background: ${({ theme, hasContent }) =>
    hasContent
      ? theme.button["create-board-alt"]
      : theme.button["create-board"]};
  width: 105px;
  border: none;
  padding: 5px;
  color: ${({ theme, hasContent }) =>
    hasContent
      ? theme.text["create-board-button-alt"]
      : theme.text["create-board-button"]};
  &:focus {
    outline: none;
  }
  cursor: ${(props) => (props.hasContent ? "pointer" : "not-allowed")};
`;

const Color = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ color }) => color};
  cursor: ${({ isSelected }) => (isSelected ? "default" : "pointer")};
  &::before {
    ${({ isSelected }) =>
      isSelected
        ? {
            content: `""`,
            width: "100%",
            height: "100%",
            background: "black",
            display: "block",
            opacity: 0.2,
          }
        : {}};
  }
  &:hover {
    &::before {
      content: "";
      width: 100%;
      height: 100%;
      background: black;
      display: block;
      opacity: 0.2;
    }
  }
`;

const CloseIcon = styled(Close)`
position:absolute;
right:5%;
top:2%;
color:${props => props.theme.icon["cbm-main-icon"]};
font-weight:200;
opacity:0.8;
cursor:pointer;
`;

const CreateBoardModal = ({onHide, ...otherProps }) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [boardTitle, setBoardTitle] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const {id:userId} = useSelector(state => state.user); 
  const dispatch = useDispatch();
  const showColors = () => {
    const ColorComponenets = colorArr.map((color, index) => {
      return (
        <dic className="color-container" style={{ padding: "5px" }} key={index}>
          {index === currentColorIndex && (
            <div className="selected-color">
              {" "}
              <CheckIcon style={{ fontSize: "1rem", opacity: 0.7 }} />
            </div>
          )}

          <Color
            isSelected={index === currentColorIndex}
            onClick={(e) => setCurrentColorIndex(index)}
            color={color}
            className="mr-2"
          />
        </dic>
      );
    });
    return ColorComponenets;
  };
  const handleCreateBoard = () => {
    if(!boardTitle)
      {
        return;
      }
      dispatch(createBoard(boardTitle,userId,currentColorIndex));
      onHide();
  }
  return (
    <Container {...otherProps} onHide={onHide} contentClassName="cbm-content">
      <ModalBody>
        <MainContent backgroundColor={colorArr[currentColorIndex]}>
          <CloseIcon onClick={onHide} />
          <div className="input-container">
            <Input
              placeholder="Add board title"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              isActive={isInputActive}
              onFocus={(e) => setIsInputActive(true)}
              onBlur={(e) => setIsInputActive(false)}
            />
          </div>
          <Buttons>
            <CreateButton hasContent={boardTitle} onClick={handleCreateBoard}>Create Board</CreateButton>
          </Buttons>
        </MainContent>
        <SideContent>
          <span className="heading">Colors</span>
          <Line className="mt-3" />
          <div
            className="side-content"
            style={{ width: "100%", height: "100%" }}
          >
            {showColors()}
          </div>
        </SideContent>
      </ModalBody>
    </Container>
  );
};

export default CreateBoardModal;
