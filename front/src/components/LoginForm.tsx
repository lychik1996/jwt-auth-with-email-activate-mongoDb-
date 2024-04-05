import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthServices';
import { setAuth, setUser } from '../store/api.slice';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors },
  } = useForm<LoginForm>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUser = async (data: LoginForm) => {
    try {
      const response = await AuthService.login(data.email, data.password);

      localStorage.setItem('token', response.data.accessToken);
      const index = data.email.indexOf('@');
      const newUser = data.email.slice(0, index).replace('.', '-');
      dispatch(setUser({ ...response.data.user, userUrl: newUser }));
      dispatch(setAuth(true));
      reset();
      if (response.status === 200) {
        navigate(`/user/${newUser}`);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setError(errorMessage.includes('password') ? 'password' : 'email', {
        message: errorMessage,
      });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(loginUser)}>
        <label htmlFor="">
          Email:
          <input type="email" {...register('email')} required={true} />
        </label>
        <div className="forError">
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <label htmlFor="">
          Password:
          <input type="password" {...register('password')} required={true} />
        </label>
        <div className="forError">
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button>Login</button>
      </form>
      <Link to="/registartion">Registartion</Link>
    </>
  );
}
