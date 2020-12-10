import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModel from '../../shared/components/UIELements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIELements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hooks';

const UsersPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [usersList, setUserList] = useState();

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const resData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );
        setUserList(resData.users);
      } catch (err) {}
    };
    getUsersList();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {error && <ErrorModel error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && usersList && <UsersList items={usersList} />}
    </React.Fragment>
  );
};

export default UsersPage;
