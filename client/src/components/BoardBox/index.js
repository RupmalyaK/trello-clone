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
import UserIconContainer from "../UserIcon";
const Container = styled.div`
  width: 300px;
  height: 150px;
  background: ${(props) => props.themeName === "light" ? props.backgroundColor : "#1f4068" };
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
  font-size: 1rem;
  margin-top:20px;
  min-width:300px;
  border-radius: 5px;

  .heading {
    padding:10px;
    max-height:60%;
  }
  .short-users {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    padding: 10px;
    min-height:30%;
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
  const {currentTheme} = useSelector(state => state.system);

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
          className="mr-3"
          userName={users[i].userName}
          key={i}
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
      themeName={currentTheme}
    
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
