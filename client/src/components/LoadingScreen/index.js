import React from 'react';
import styled from "styled-components";
import './index.scss';
import {useSelector} from "react-redux";
//${props => props.theme.background.loader}
const Container = styled.div`
background:${props => props.currentTheme === "light" ? "#fff" : "#1b1b2f" };
height:100vh;
width:100vw;
`;

export default function LoadingScreen() {
  const {currentTheme} = useSelector(state => state.system);
  return (
    <Container currentTheme={currentTheme}>
      <div className="loader">
        <div className="loader__figure"></div>
        <p className="loader__label">Trello</p>
      </div>
    </Container>
  );
}