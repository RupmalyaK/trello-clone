import React from "react";
import styled from "styled-components";

const Container = styled.div`
width: 32px;
height: 32px;
color: white;
background: ${(props) => props.theme.icon.header};

cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
&:hover {
  background: ${(props) => props.theme.icon["header-hover"]};
}
`;

const Icon = ({children,...otherProps}) => {
    return (<Container {...otherProps}>
        {children}
    </Container>)
}

export default Icon;