import React, { useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hooks';
import ErrorModal from '../../shared/components/UIELements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIELements/LoadingSpinner';

const UserPlaces = () => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    const asyncGetData = async () => {
      try {
        const resData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(resData.places);
      } catch (err) {}
    };
    asyncGetData();
  }, [sendRequest, userId]);

  // const loadedPlaces = DUMMY_PLACES.filter(
  //   ({ creatorId }) => creatorId === userId
  // );
  const placeDeleteHandler = (placeId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((plc) => plc.id !== placeId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <PlaceList items={loadedPlaces} onDelete={placeDeleteHandler} />
    </React.Fragment>
  );
};

export default UserPlaces;
