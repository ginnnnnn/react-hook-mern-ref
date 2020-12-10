import { useReducer, useCallback } from 'react';
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputKey in state.inputs) {
        if (!state.inputs[inputKey]) {
          continue;
        }
        if (inputKey === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputKey].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    case 'SET_FORM_DATA':
      return {
        inputs: action.inputs,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInput, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInput,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      inputId: id,
      value,
      isValid,
    });
  }, []);

  const setFormData = useCallback((inputsData, formValidity) => {
    dispatch({
      type: 'SET_FORM_DATA',
      inputs: inputsData,
      isValid: formValidity,
    });
  }, []);
  return [formState, inputHandler, setFormData];
};
