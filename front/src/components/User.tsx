import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../services/AuthServices';
import { setAuth, setUser } from '../store/api.slice';
import { IUser } from '../models/iUser';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserService from '../services/UserService';

export interface ApiUser {
  user: IUser;
  isAuth: boolean;
}
const User = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const user = useSelector((state: { api: ApiUser }) => state.api.user);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    const activationTimeOut = setTimeout(() => {
      setShowMessage(true);
    }, 2000);
    return () => clearInterval(activationTimeOut);
  }, []);

  const { username } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = async () => {
    try {
      const response = await AuthService.logout();
      localStorage.clear();
      dispatch(setAuth(false));
      dispatch(setUser({} as IUser));
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };
  const getUsers = async () => {
    
    try {
      const response = await UserService.fetchUsers();
       user.isActivated && setUsers(response.data);
    } catch (e) {}
  };
  return (
    <>
      {showMessage && !user.isActivated && <h1>Pls activate account</h1>}
      {user?.userUrl === username ? (
        <button onClick={() => logoutUser()}>Logout</button>
      ) : (
        <button onClick={() => navigate(`/user/${user.userUrl}`)}>Go home</button>
      )}
      <button onClick={() => getUsers()}>Give all users</button>
      <ul>{users?.map((user) => <li key={user.email}>{user.email}</li>)}</ul>
    </>
  );
};
export default User;
