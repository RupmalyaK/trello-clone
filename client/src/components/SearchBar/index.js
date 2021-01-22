import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { Search as Search, Close as Close } from "@material-ui/icons";

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

const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);
  const searchBarController = useAnimation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      widenSearchBar();
      return;
    }
    shrinkSearchBar();
  }, [isActive]);

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
    >
      <SearchInput
        onFocus={(e) => setIsActive(true)}
        onBlur={(e) => setIsActive(false)}
        ref={inputRef}
      />

      {isActive ? (
        <CloseIcon />
      ) : (
        <SearchIcon
          onClick={(e) => inputRef.current && inputRef.current.focus()}
        />
      )}
    </Container>
  );
};
export default SearchBar;
