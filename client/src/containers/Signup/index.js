import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as TrelloLogo } from "../../assets/images/trello-login-icon.svg";
import Input from "../../components/Input";
import PasswordStrengthBar from "react-password-strength-bar";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { signUpAsync as signUp,clearSignUpErrors } from "../../store/actions/userAction.js";
import {useHistory} from "react-router-dom";
import Toggle from "../../components/Toggle";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.theme.background.outer};
`;
const SignUpBox = styled.form`
  min-height: 450px;
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
  .error{
      color:red;
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
const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError,setConfirmPasswordError] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const {signUpErrors,id} = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    dispatch(clearSignUpErrors());
  },[]);
  
  if(id)
    {
      history.push("/boards");
      return<></>
    }
  const { displayNameErrors, emailErrors, passwordErrors } = signUpErrors || {};

  const handleSignUp = () => {
    if(confirmPassword !== password)
        {
            setConfirmPasswordError("Confirm password did not matched");
            return;
        }
    dispatch(signUp({ displayName: fullName, email, password }));
  };

  const showErrors = (errors) => {
      if(!errors)
        {
            return;
        }
    const ErrorComponents = errors.map((error) => {
      return <span className="error">{error}</span>;
    });
    return (
        <div className="d-flex flex-column">
            {ErrorComponents}
        </div>   
    );
  };

  return (
    <Container>
      <Logo />
      <SignUpBox onSubmit={(e) => e.preventDefault()}>
        <span className="heading mb-4">Sign up for your account</span>
        {showErrors(emailErrors)}
        <Input
          className="mb-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
        {showErrors(displayNameErrors)}
        <Input
          className="mb-3"
          type="text"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {showErrors(passwordErrors)}
        <div className="input-password-container" style={{ width: "100%" }}>
          <Input
            className="mb-3"
            type="password"
            value={password}
            showVisibiltyIcon
            placeholder="Create password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrengthBar password={password} />
        </div>
         <span className="error">{confirmPasswordError}</span>
        <Input
          className="mb-3"
          type="password"
          value={confirmPassword}
          placeholder="Enter password again"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button className="mb-4" onClick={handleSignUp}>
          Sign Up
        </Button>
        <Line className="mb-5" />
        <span className="login-text" onClick={e => history.push("/signin")}>
          Already have an Atlassian account? Log in
        </span>
      </SignUpBox>
      <Toggle className="switch mt-5"/>
    </Container>
  );
};

export default Signup;
