import React, { useContext } from 'react';
import { AuthContext } from '../../shared/contexts/auth-context';
import { useForm } from '../../shared/hooks/form-hooks';
import { useHttpClient } from '../../shared/hooks/http-hooks';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIELements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIELements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/imageUpload';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import './Placeform.css';

const NewPlacePage = () => {
  const Auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const history = useHistory();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', formState.inputs.image.value);
    formData.append('title', formState.inputs.title.value);
    formData.append('description', formState.inputs.description.value);
    formData.append('address', formState.inputs.address.value);

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + Auth.token,
        }
      );
      //redirect page
      history.push('/');
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={handleOnSubmit}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid title"
          onInput={inputHandler}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="please enter a valid description ,at least 5 characters"
          onInput={inputHandler}
        />
        <Input
          id="address"
          label="Address"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="please pick a valid image"
        />
        <Button
          type="submit"
          disabled={!formState.isValid}
          onClick={handleOnSubmit}
        >
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlacePage;
