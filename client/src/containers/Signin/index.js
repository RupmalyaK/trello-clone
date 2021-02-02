import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as TrelloLogo } from "../../assets/images/trello-login-icon.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { signInAsync as signIn,clearSignInErrors } from "../../store/actions/userAction.js";
import {useHistory} from "react-router-dom";
import Toggle from "../../components/Toggle";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.theme.background.outer};
  .error{
    color:red !important;
}
`;
const SignInBox = styled.form`
  min-height: 400x;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 40px;
  border-radius: 3px;
  background: ${(props) => props.theme.background["login-box"]};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;
 
  .heading {
    color: ${(props) => props.theme.text.heading};
    font-size: 1.2rem;
    font-weight: 600;
  }
 
  .login-text {
    color: ${(props) => props.theme.text["signUp-bottom"]};
    font-weight: 400;
    cursor: pointer;
    &:hover {
      border-bottom: 1px solid ${(props) => props.theme.text["signUp-bottom"]};
    }
  }
`;

const Logo = styled(TrelloLogo)`
  width: 130px;
  height: 90px;
`;

const Line = styled.div`
  width: 100%;
  height: 10px;

  border-top: 1px solid ${(props) => props.theme.border.line};
`;
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signInErrors,id} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const history = useHistory();


  useEffect(() => {
    dispatch(clearSignInErrors());
  },[]);

  const handleSignIn = () => {
    dispatch(signIn(email,password));
    history.push("/boards");
  };


  if(id)
    {
      history.push("/boards");
      return <></>;
    }
  return (
    <Container>
      <Logo />
      <SignInBox onSubmit={(e) => e.preventDefault()}>
        <span className="heading mb-4">Sign In to for your account</span>
        <span className="error">{signInErrors}</span>
        <Input
          className="mb-3 mt-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
 
      
        <Input
          className="mb-3"
          type="password"
          value={password}
          placeholder="Enter password again"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="mb-4" onClick={handleSignIn}>
          Sign In
        </Button>
        <Line className="mb-5" />
        <span className="login-text" onClick={e => history.push("/signup")}>
          Don't have an Account? Sign up.
        </span>
      </SignInBox>
      <Toggle className="switch mt-5"/>
    </Container>
  );
};

export default SignIn;
