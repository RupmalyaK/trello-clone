import React,{useState} from "react";
import styled from "styled-components";
import SearchBar from "../SearchBar";
import logo from "../../assets/images/header-logo.png";
import {useSelector} from "react-redux";
import {Add as AddIcon} from '@material-ui/icons';
import CreateBoardModal from "../CreateBoardModal";
import {colorArr} from "../../utils/constants.js";
import {useHistory} from "react-router-dom";
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
  .search-container{
    flex:1;
    display:flex;
    justify-content:center;

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
`;

const Logo = styled.img`
height:30px;
width:80px;
opacity:0.5;
cursor:pointer;
&:hover{
    opacity:1;
}
`;

const ProfileIcon = styled.div`

width:32px;
height:100%;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
color:white;
cursor:pointer;
background:${props => props.backgroundColor};
`;


const Header = () => {
  const {displayName,colorIndex} = useSelector(state => state.user);  
  const [showCBM,setShowCBM] = useState(false);
  const history = useHistory();
  return (
    <Container>
        <CreateBoardModal show={showCBM} onHide={() => setShowCBM(false)}/>
      <div className="search-container">
          <SearchBar />
      </div>
      <div className="logo-container">
          <Logo src={logo} alt="logo" onClick={e => history.push("/boards")}/>
      </div>
      <div className="buttons-container">
          <Icon className="mr-3" onClick={e => setShowCBM(true)}>
              <AddIcon style={{fontSize:"1.7rem"}}/>
          </Icon>
          <ProfileIcon className="mr-3" backgroundColor={colorArr[colorIndex]}>
              {displayName.charAt(0).toUpperCase()}
          </ProfileIcon>

      </div>

    </Container>
  );
};

export default Header;
