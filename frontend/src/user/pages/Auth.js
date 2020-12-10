import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIELements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hooks';
import { AuthContext } from '../../shared/contexts/auth-context';
import { useForm } from '../../shared/hooks/form-hooks';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import ErrorModal from '../../shared/components/UIELements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIELements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/imageUpload';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const authSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      try {
        const resData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(resData.userId, resData.token);
      } catch (err) {}
    } else {
      try {
        //sign up
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const resData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          formData
        );
        auth.login(resData.userId, resData.token);
      } catch (err) {}
    }

    // /api/users/signup
  };
  const switchAuthModeHandler = () => {
    if (isLoginMode) {
      //switching to sign up
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    } else {
      //switching to login mode ,keep email and password valid
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setIsLoginMode((preMode) => !preMode);
  };

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Require</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              type="text"
              label="Name"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="please enter a valid Name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="please pick a valid image"
            />
          )}
          <Input
            id="email"
            type="text"
            label="E-mail"
            element="input"
            validators={[VALIDATOR_EMAIL()]}
            errorText="please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            type="text"
            label="Password"
            element="input"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="please enter a valid password,at least 6 characters"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGN UP'}
          </Button>
        </form>
        <Button onClick={switchAuthModeHandler}>
          {isLoginMode ? 'switch to Sign up' : 'switch to login'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
