import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Close, MoreHoriz } from "@material-ui/icons";
import { colorArr } from "../../utils/constants.js";

const Container = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  .side-content {
    width: 300px;
    height: 300px;
    background:${props => props.theme.background.dropdown};
    padding: 10px;
    overflow: scroll;
    position: absolute;
    right: 0%;
    left: 0%;
    bottom: 0%;
    z-index: 50;
    box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
    border: 1px solid black;
  }
  .title-container {
    height: 150px;
    width: 100%;
    position: relative;
  }
  .title {
    width: 100%;
    height: 100%;
    padding-top: 21px;
    border: 0px;
    background:${props => props.theme.background.textArea};
    font-size: 1.2rem;
    &:focus {
      border: none;
      outline: none;
    }
    ::placeholder {
      font-size: 1.2rem;
    }
  }
  .buttons-container {
    display: flex;
    width: 100%;
    margin-top: 10px;
    font-size: 1.2rem;
  }
  .add-card-button-button {
    height: 40px;
    width: 100px;
    background: ${props => props.theme.button.signUp};
    border: 0px;
    color: rgb(255, 255, 255);
    border-radius: 3px;
    cursor: pointer;
    margin-right: 10px;
    &:focus {
      outline: none;
    }
    &:hover {
      background: ${props => props.theme.button["signUp-hover"]};
    }
  }
  .left-side {
    flex: 2;
  }
  .right-side {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .side-content-content {
    display: flex;
    flex-direction: column;
  }
`;

const CloseIcon = styled(Close)`
  font-size: 2.2rem !important;
  cursor: pointer;
  color: #6b778c;

  &:hover {
    color: #42526e;
  }
`;

const MoreHorizIcon = styled(MoreHoriz)`
  font-size: 2.2rem !important;
  cursor: pointer;
  color: #6b778c;
  &:hover {
    color: #42526e;
  }
`;

const Color = styled.div`
  height: 50px;
  width: 100%;
  margin-bottom: 5px;
  background: ${(props) => props.backgroundColor};
  cursor: pointer;
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

const SelectedColor = styled.div`
  background: ${(props) => props.backgroundColor};
  height: 20px;
  width: 30%;
  position: absolute;
  margin: 5px;
`;
const AddCard = ({
  handleClose,
  handleSubmit,
  category,
  ...otherProps
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [colorIndex, setColorIndex] = useState(-1);
  const [title, setTitle] = useState("");
  const titleInputRef = useRef(null);
  const showColors = () => {
    const ColorComponenets = colorArr.map((color, index) => (
      <Color
        backgroundColor={color}
        onClick={(e) => {
          setColorIndex(index);
          setShowOptions(false);
        }}
      />
    ));
    return ColorComponenets;
  };
  useEffect(() => {
      titleInputRef.current && titleInputRef.current.focus();
  }, []);
  return (
    <Container {...otherProps}>
      <div className="title-container">
        <SelectedColor backgroundColor={colorArr[colorIndex]} />
        <textarea
          ref={titleInputRef}
          placeholder="Enter a title for this card..."
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="buttons-container">
        <div className="left-side">
          <button
            className="add-card-button-button"
            onClick={(e) => handleSubmit(title, colorIndex, category)}
          >
            Add Card
          </button>
          <CloseIcon onClick={handleClose} />
        </div>
        <div className="right-side">
          <MoreHorizIcon onClick={(e) => setShowOptions(!showOptions)} />
        </div>
      </div>

      {showOptions && (
        <div className="side-content">
          <div
            className="heading"
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              marginBottom: "5px",
            }}
          >
            Color
          </div>
          <div className="side-content-content">{showColors()}</div>
        </div>
      )}
    </Container>
  );
};

export default AddCard;
