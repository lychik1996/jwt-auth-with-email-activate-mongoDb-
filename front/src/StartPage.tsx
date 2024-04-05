import axios from 'axios';
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate} from 'react-router-dom';
import { AuthResponse } from './models/response/AuthResponse';
import { APi_URL } from './http';
import { setAuth, setUser } from './store/api.slice';
import { useDispatch } from 'react-redux';

export default function StartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [intervalId, setIntervalId] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (localStorage.getItem('token')) {
          const response = await axios.get<AuthResponse>(`${APi_URL}/refresh`, {
            withCredentials: true,
          });
          localStorage.setItem('token', response.data.accessToken);
          const index = response.data.user.email.indexOf('@');
          const userUrl = response.data.user.email
            .slice(0, index)
            .replace('.', '-');
          dispatch(setUser({ ...response.data.user, userUrl }));
          dispatch(setAuth(true));
        } else {
          localStorage.clear();
          navigate('/');
        }
      } catch (e) {
        localStorage.clear();
        dispatch(setAuth(false));
        navigate('/');
      }
    };
    checkUser();
    const id = setInterval(checkUser, 15000);
    setIntervalId(id);
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, navigate]);

  return (
    <>
      <Suspense fallback={<div>...loading</div>}>
        <Outlet />
      </Suspense>
    </>
  );
}
