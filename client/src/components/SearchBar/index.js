import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { Search as Search, Close as Close } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {colorArr} from "../../utils/constants.js";
const Container = styled(motion.div)`
  background: ${({ theme, isActive }) =>
    isActive
      ? theme.background["searchBar-wide"]
      : theme.background["searchBar-small"]};

  border-radius: 3px;
  height: 100%;
  position: relative;
  color: ${({ isActive, theme }) =>
    isActive
      ? theme.icon["search-bar-wide-icon"]
      : theme.icon["search-bar-small-icon"]};

  &:hover {
    background: ${({ theme, isActive }) =>
      isActive
        ? theme.background["searchBar-wide"]
        : theme.background["searchBar-small-hover"]};
  }
  border-radius:3px;
  position: relative;
  .result-container {
    width: 100%;
    min-height: 200px;
    max-height:200px;
    background: #fff;
    position: absolute;
    z-index: 100;
    display: flex;
    flex-direction: column;
    overflow-x:hidden;
    overflow-y:scroll;
    box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25),
    0 0 0 1px rgba(9, 30, 66, 0.08);
      background:${props => props.theme.background.dropdown};
  }
  .result {
    height: 50px;
    cursor: pointer;
    display:flex;
    justify-content:space-between;
    padding:10px;
    color:${props => props.theme.text["searchBar-result"]};
    &:hover{
      background:#999999;
    }
  }
  
`;

const SearchInput = styled.input`
  width: 100%;
  background: none;
  border: none;
  outline: none;
  padding: 5px;
  height: 100%;
  color: ${(props) => props.theme.text.searchBar};
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 3%;
  top: 23%;
`;

const CloseIcon = styled(Close)`
  position: absolute;
  right: 3%;
  top: 23%;
`;

const ColorBox = styled.div`
height:20px;
width:50px;
background:${props => props.backgroundColor};
border-radius:10%;
`;
const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);
  const searchBarController = useAnimation();
  const { boards } = useSelector((state) => state.boards);
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);
  const [searchString, setSearchString] = useState("");
  const [isShowingResults, setIsShowingResults] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (isActive) {
      widenSearchBar();
      return;
    }
    shrinkSearchBar();
  }, [isActive]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target)
      ) {
        setIsActive(false);
        setIsShowingResults(false);
       
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    const handleUnmount = () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
    return handleUnmount;
  }, []);
  const handleChange = (e) => {
    setSearchString(e.target.value);
  };

  const showResult = () => {
    if (!searchString) {
      return <></>;
    }
    let filteredBoards = boards.filter((board) =>
      board.name.match(new RegExp(searchString, "i"))
    );
    const startsWith = [];
    const notStartWith = [];
    filteredBoards.forEach((board) => {
      if (board.name.match(new RegExp(`^${searchString}`, "i"))) {
        startsWith.push(board);
        return;
      }
      notStartWith.push(board);
    });
    filteredBoards = [...startsWith, ...notStartWith];
    const BoardComponents = filteredBoards.map((board) => {
      return (
        <div className="result" onClick={e => {
          history.push(`/${board._id}/dashboard`);
          setIsShowingResults(false);
          setIsActive(false);
        }}>
          <ColorBox backgroundColor={colorArr[board.colorIndex]}/>
          <div className="name">{board.name}</div>
        </div>
      );
    });
    return BoardComponents ;
  };
  const widenSearchBar = () => {
    searchBarController.start({ width: "300px", transform: { duration: 1 } });
  };

  const shrinkSearchBar = () => {
    searchBarController.start({ width: "184px", transform: { duration: 1 } });
  };
  return (
    <Container
      initial={{ width: "184px" }}
      animate={searchBarController}
      isActive={isActive}
      ref={searchBarRef}
    >
      <SearchInput
        onFocus={(e) => {
          setIsActive(true);
          setIsShowingResults(true);
        }}
       
        ref={inputRef}
        value={searchString}
        onChange={handleChange}
      />

      {isActive ? (
        <CloseIcon onClick={e => {
          setIsActive(false);
          setIsShowingResults(false);
        }}/>
      ) : (
        <SearchIcon
          onClick={(e) => inputRef.current && inputRef.current.focus()}
        />
      )}
      {isShowingResults && searchString && (
        <div className="result-container">{showResult()}</div>
      )}
    </Container>
  );
};
export default SearchBar;
