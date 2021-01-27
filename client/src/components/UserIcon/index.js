import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: ${(props) => props.backgroundColor};
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: ${(props) => props.theme.text["board-box"]};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: default;
  &:hover {
    &::before {
      content: "${(props) => props.userName}";
      position: absolute;
      display: block;
      height: 22px;
      left: 50%;
      top: 50%;
      font-size: 1rem;
      color: black;
      padding: 2px;
      background: white;
      border-radius: 3px;
      z-index:100;
      box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25),
        0 0 0 1px rgba(9, 30, 66, 0.08);
    }
  }
`;

const UserIcon = ({ children, ...otherProps }) => (
  <Container {...otherProps}>{children}</Container>
);

export default UserIcon;
