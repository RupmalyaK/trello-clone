import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import SearchBar from "../SearchBar";
import logo from "../../assets/images/header-logo.png";
import { useSelector } from "react-redux";
import { Add as AddIcon } from "@material-ui/icons";
import CreateBoardModal from "../CreateBoardModal";
import { colorArr } from "../../utils/constants.js";
import { useHistory } from "react-router-dom";
import {useDispatch} from "react-redux";
import {signOut} from "../../store/actions/userAction.js";
import Toggle from "../Toggle";
import Icon from "../Icon";
const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 40px;
  background: ${(props) => props.theme.background.header};
  border:1px solid ${(props) => props.theme.background.header};
  display:flex;
  padding-top:3px;
  z-index:100;
  padding-bottom:2px;
  .toggle-container{
    flex:1;
    background:red;
    display:flex;
    justify-content:center;
  }
  .search-container{
    flex:1;
    display:flex;
    justify-content:flex-start;
    align-items:center;

   
  }
  .logo-container{
    flex:1;
    display:flex;
    justify-content:center;]

 
  }
  .buttons-container{
    flex:1;
    display:flex;
    justify-content:flex-end;
  }
  .logout-button{
    cursor:pointer;
    padding:10px;
    &:hover{
      background:rgb(247, 240, 240);
    }
  }
  .profile-icon-container{
    position:relative;
    .profile-menu{
      height:100px;
      width:200px;
      position:absolute;
      background:#fff;
      transform:translateX(-170px);
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      align-items:center;
    
      box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25),
      0 0 0 1px rgba(9, 30, 66, 0.08);
    }
  }
`;

const Logo = styled.img`
  height: 30px;
  width: 80px;
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const ProfileIcon = styled.div`
  width: 32px;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  background: ${(props) => props.backgroundColor};
`;

const Header = () => {
  const { displayName, colorIndex, userName } = useSelector(
    (state) => state.user
  );
  const [showCBM, setShowCBM] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    const handleUnmount = () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
    return handleUnmount;
  }, []);
  return (
    <Container>
      <CreateBoardModal show={showCBM} onHide={() => setShowCBM(false)} />
   
      <div className="search-container">
        <Toggle className="switch mr-3" style={{marginLeft:"30%"}}/>
        <SearchBar />
      </div>
      <div className="logo-container">
        <Logo src={logo} alt="logo" onClick={(e) => history.push("/boards")} />
      </div>
      <div className="buttons-container">
        <Icon className="mr-3" onClick={(e) => setShowCBM(true)}>
          <AddIcon style={{ fontSize: "1.7rem" }} />
        </Icon>
        <div
          className="profile-icon-container"
          onClick={(e) => setIsProfileMenuOpen(true)}
        >
          <ProfileIcon className="mr-3" backgroundColor={colorArr[colorIndex]}>
            {displayName.charAt(0).toUpperCase()}
          </ProfileIcon>
          {isProfileMenuOpen && (
            <div className="profile-menu" ref={profileMenuRef}>
              <div>@{userName}</div>
              <div
                className="logout-button"
                style={{
                  borderTop: "1px solid black",
                  paddingTop: "10px",
                  width: "100%",
                  textAlign: "center",
                }}
                onClick={e => {
                  dispatch(signOut());
                  setIsProfileMenuOpen(false);
                }}
              >
                Logout
              </div>
            </div>
          )}
          "
        </div>
      </div>
    </Container>
  );
};

export default Header;
