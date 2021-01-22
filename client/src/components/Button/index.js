import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
background:${props => props.theme.button.signUp};
height:40px;
width:100%;
border-radius:3px;


&:hover{
    background:${props => props.theme.button["signUp-hover"]};
}
`;

const CButton = styled.button`
border:0px;
background:none;
width:100%;
height:100%;
display:flex;
justify-content:center;
align-items:center;
color:${props => props.theme.text.signUp};
font-style:normal;
font-weight:500;
cursor:pointer;
`;

const Button = ({children,onClick,...otherProps}) => {

    return( <ButtonContainer {...otherProps}>
            <CButton onClick={onClick}>{children}</CButton>
    </ButtonContainer>);
}

export default Button; 