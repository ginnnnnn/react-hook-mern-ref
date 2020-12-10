import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from '../../shared/hooks/form-hooks';
import Card from '../../shared/components/UIELements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/contexts/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hooks';
import LoadingSpinner from '../../shared/components/UIELements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIELements/ErrorModal';

import './Placeform.css';

const UpdatePlace = () => {
  const Auth = useContext(AuthContext);
  const { push } = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [matchedPlace, setMatchedPlace] = useState(null);
  const placeId = useParams().placeId;
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: true,
      },
      description: {
        value: '',
        isValid: true,
      },
    },
    true
  );
  useEffect(() => {
    const fetchPlact = async () => {
      try {
        const resData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setMatchedPlace(resData.place);
        setFormData(
          {
            title: {
              value: resData.place.title,
              isValid: true,
            },
            description: {
              value: resData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlact();
  }, [placeId, sendRequest, setFormData]);

  if (!matchedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // http://localhost:5000/api/places/5f6319f9f6b56785d130a4ca
    //patch
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + Auth.token,
        }
      );
      //place
      push('/' + Auth.userId + '/places');
    } catch (err) {}

    // console.log(formState);
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && matchedPlace && (
        <form className="place-form" onSubmit={handleOnSubmit}>
          <Input
            label="Title"
            id="title"
            type="text"
            element="input"
            errorText="please enter a valid Title"
            onInput={inputHandler}
            initialValue={matchedPlace.title}
            initialValid={true}
            validators={[VALIDATOR_REQUIRE()]}
          />
          <Input
            label="Description"
            id="description"
            type="text"
            errorText="please enter a valid description,at least 5 charaters"
            onInput={inputHandler}
            initialValue={matchedPlace.description}
            initialValid={true}
            validators={[VALIDATOR_MINLENGTH(5)]}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
