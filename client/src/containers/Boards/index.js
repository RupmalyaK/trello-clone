import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoards } from "../../store/actions/boardAction.js";
import BoardBox from "../../components/BoardBox";
import {useHistory} from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";

const Container = styled.div`
  min-height:100vh;
  width:100vw;
  background:${props => props.theme.background.boards};
  .content {
    padding: 30px;
    margin-top: 20px;
    display: flex;
    width:100%;
    flex-wrap:wrap;
   
  }
  .heading{
    color:${props => props.theme.text["boards-heading"]};
    display:block;
    text-align:center;
    font-size:2rem;
  }
  .content-container{
    padding:50px;
    display:flex;
    flex-direction:column;
    align-items:stretch;

  }
`;

const Boards = (props) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user);
  const { boards,isLoading } = useSelector((state) => state.boards);
  const history = useHistory();
  useEffect(() => {
    dispatch(getAllBoards(id));
  }, []);

  if(!id)
    {
        history.push("/signin");
        return <></>;
    }
  if(isLoading)
    {
      return <LoadingScreen />;
    }
  const showStarredBoards = () => {
    if (!boards) {
      return;
    }
    const starredBoards = boards.filter((board) => board.starred);
    const BoardComponents = starredBoards.map(
      ({ name, colorIndex, users, _id, starred },index) => (
        <BoardBox
          name={name}
          starred={starred}
          colorIndex={colorIndex}
          id={_id}
          users={users}
          className="mr-4"
          key={index}
        />
      )
    );
    return BoardComponents;
  };

  const showNonStarredBoards = () => {
    if (!boards) {
      return;
    }
    const nonStarredBoards = boards.filter((board) => !board.starred);
    const BoardComponents = nonStarredBoards.map(
      ({ name, colorIndex, users, _id, starred },index) => (
        <BoardBox
          name={name}
          starred={starred}
          colorIndex={colorIndex}
          id={_id}
          users={users}
          className="mr-4"
          key={index}
        />
      )
    );
    return BoardComponents;
  };

 
  return (
    <Container>
      <Header />
      <section className="content-container">
        <div className="starred-boxes">
          <span className="heading">Starred Boards</span>
          <section className="content">{showStarredBoards()}</section>
        </div>
        <div className="Boxes">
            <span className="heading">Personal Board</span>
          <div className="content">
            {showNonStarredBoards()}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Boards;
