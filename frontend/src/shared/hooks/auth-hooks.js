import { useEffect, useCallback, useState } from 'react';

let logoutTimer;
const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const login = useCallback((uid, token, expiration) => {
    setToken(token);
    setUserId(uid);
    const expirationDate =
      expiration || new Date(new Date().getTime() + 60 * 1000 * 60);
    setTokenExpirationDate(expirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expirationDate: expirationDate.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);
  useEffect(() => {
    const resData = JSON.parse(localStorage.getItem('userData'));
    if (
      resData &&
      resData.token &&
      new Date(resData.expirationDate) > new Date()
    ) {
      login(resData.userId, resData.token, new Date(resData.expirationDate));
    }
  }, [login]);
  // auto login  and logout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      //token exist ,tokenExpirationDate exist  ,count the remain time
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      console.log(remainingTime);
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpirationDate]);
  return { login, logout, token, userId };
};

export default useAuth;
