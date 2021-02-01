import React,{useState} from "react";
import styled from "styled-components";
import {Visibility as VisibilityIcon,VisibilityOff as VisibilityOffIcon} from "@material-ui/icons";

const InputContainer = styled.div`
width:100%;
height:40px;
background:${props => props.theme.background.input};
border-radius:3px;
display:flex;
position:relative;
.visibility-icon-container{
position:absolute;
right:3%;
top:23%;

}
`
;

const InputContent = styled.input`
width:100%;
height:100%;
border:none;
outline:none;
background:none;
padding:10px;
font-size:1rem;
border:2px solid ${props => props.theme.border["input-border"]};
color:${props => props.theme.text.auth};
&:hover{
  background:${props => props.theme.background["input-hover"]};
}
&:focus{
  border-color:${props => props.theme.border["input-border-focus"]};
}
`;

// 
const Input = ({ style,className,type,showVisibiltyIcon,...otherProps }) => {
  const [isVisible,setIsVisible] = useState(false);
  return(
  <InputContainer style={style} className={className}>
       <InputContent {...otherProps}  type={isVisible ? "text" : type} />
       {showVisibiltyIcon && <div className="visibility-icon-container">
         {!isVisible ? <VisibilityIcon onClick={e => setIsVisible(true)}/> : <VisibilityOffIcon onClick={e => setIsVisible(false)}/>}
       </div>}
  </InputContainer>);

};

export default Input;
