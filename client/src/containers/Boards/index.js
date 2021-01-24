import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoards } from "../../store/actions/boardAction.js";
import BoardBox from "../../components/BoardBox";

const Container = styled.div`
  .content {
    padding: 30px;
    margin-top: 20px;
    display: flex;
    width:100%;
   
  }
  .heading{
   
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
  const { boards } = useSelector((state) => state.boards);
 

  const showStarredBoards = () => {
    if (!boards) {
      return;
    }
    const starredBoards = boards.filter((board) => board.starred);
    const BoardComponents = starredBoards.map(
      ({ name, colorIndex, users, _id, starred }) => (
        <BoardBox
          name={name}
          starred={starred}
          colorIndex={colorIndex}
          id={_id}
          users={users}
          className="mr-4"
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
      ({ name, colorIndex, users, _id, starred }) => (
        <BoardBox
          name={name}
          starred={starred}
          colorIndex={colorIndex}
          id={_id}
          users={users}
          className="mr-4"
        />
      )
    );
    return BoardComponents;
  };

  useEffect(() => {
    dispatch(getAllBoards(id));
  }, []);
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
