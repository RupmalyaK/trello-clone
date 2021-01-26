import React from "react";
import styled from "styled-components";
import { colorArr } from "../../utils/constants.js";
import {
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@material-ui/icons";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { updateBoard } from "../../store/actions/boardAction.js";
import { useHistory } from "react-router-dom";
const Container = styled.div`
  width: 300px;
  height: 150px;
  background: ${(props) => props.backgroundColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 10px;
  color: ${(props) => props.theme.text["board-box"]};
  font-weight: 700;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 5px;
  .heading {
    margin: 10px;
  }
  .short-users {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &:hover {
    &::before {
      content: "";
      width: 100%;
      height: 100%;
      background: black;
      display: block;
      opacity: 0.2;
      position: absolute;
      margin-top: -10px;
    }
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

const StarContainer = styled(motion.div)`
  position: absolute;
  right: 5%;
  top: 2%;
`;

const BoardBox = ({ name, colorIndex, users, id, starred, ...otherProps }) => {
  const starController = useAnimation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id: userId } = useSelector((state) => state.user);

  const starShow = () => {
    starController.start({ x: 0, transition: { duration: 0.5 } });
  };

  const starHide = () => {
    starController.start({ x: 50, transition: { duration: 0.5 } });
  };

  const showUsersIcon = () => {
    const UserIconComponenets = [];

    for (let i = 0; i <= users.length - 1; i++) {
      if (i == 3) {
        break;
      }
      UserIconComponenets.push(
        <UserIconContainer
          backgroundColor={colorArr[users[i].colorIndex]}
          className="ml-3"
        >
          {users[i].shortName}
        </UserIconContainer>
      );
    }
    return UserIconComponenets;
  };
  console.log("check this out", starred);
  return (
    <Container
      backgroundColor={colorArr[colorIndex]}
      onMouseEnter={(e) => starShow()}
      onMouseLeave={(e) => starHide()}
      {...otherProps}
      onClick={(e) => history.push(`/${id}/dashboard`)}
    >
      <StarContainer initial={{ x: 50 }} animate={starController}>
        {starred ? (
          <></>
        ) : (
          <StarBorderIcon
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(
                updateBoard(id, { starred: true, userId, isChangingStar: true })
              );
            }}
          />
        )}
      </StarContainer>
      {starred && (
        <StarContainer
          StarBorderIcon
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            dispatch(
              updateBoard(id, { starred: false, isChangingStar: true, userId })
            );
          }}
        >
          <StarIcon />
        </StarContainer>
      )}
      <span className="heading">{name}</span>
      <div className="short-users">
        {showUsersIcon()}
        {users.length > 3 && (
          <span style={{ fontSize: "1rem", marginRight: "20px" }}>
            {users.length - 3} more users
          </span>
        )}
      </div>
    </Container>
  );
};

export default BoardBox;
