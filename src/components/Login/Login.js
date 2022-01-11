import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return {value: action.val, isValid: action.val.includes('@')};
    case 'INPUT_BLUR':
      return {value: state.value, isValid: state.value.includes('@')}
    default:
      break;
  }
}

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
        return {value: action.val, isValid: action.val.trim().length > 6};
    case 'INPUT_BLUR':
        return {value: state.value, isValid: state.value.trim().length > 6};
    default:
      break;
  }
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmailAction] = useReducer(emailReducer, {value:'', isValid: null});
  const [passwordState, dispatchPasswordAction] = useReducer(passwordReducer, {value: '', isValid: null});

  //Object Destructuring: it will save the state and will only update when there is a change in state, useful in useEffect
  const {isValid: emailValid} = emailState;
  const {isValid: passwordValid} = passwordState;

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
        emailValid && passwordValid
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailValid, passwordValid]);

  const emailChangeHandler = (event) => {
    dispatchEmailAction({type: 'USER_INPUT', val: event.target.value});

    setFormIsValid(
      event.target.value.includes('@') && passwordState.value.trim().length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPasswordAction({type: 'USER_INPUT', val: event.target.value});

    setFormIsValid(
      emailState.value.includes('@') && passwordState.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmailAction({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPasswordAction({type:'INPUT_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
