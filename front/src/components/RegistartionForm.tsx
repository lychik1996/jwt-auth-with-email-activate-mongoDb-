import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthServices';
import { useDispatch } from 'react-redux';
import { setAuth, setUser } from '../store/api.slice';

interface LogoutForm {
  email: string;
  password: string;
}
export default function RegistartionForm() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setError,
  } = useForm<LogoutForm>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registartionUser = async (data: LogoutForm) => {
    try {
      const response = await AuthService.registration(
        data.email,
        data.password
      );

      localStorage.setItem('token', response.data.accessToken);
      const index = data.email.indexOf('@');
      const newUser = data.email.slice(0, index).replace('.', '-');
      dispatch(setUser({ ...response.data.user, userUrl: newUser }));
      dispatch(setAuth(true));
      if(response.status===200){
        navigate(`/user/${newUser}`);
      }
      reset();
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setError(errorMessage.includes('validation') ? 'password' : 'email', {
        message: errorMessage,
      });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(registartionUser)}>
        <label htmlFor="">
          Email:
          <input type="email" {...register('email')} required={true} />
        </label>
        <div className="forError">
          {errors.email && <p>user with this mail exist </p>}
        </div>
        <label htmlFor="">
          Password:
          <input type="password" {...register('password')} required={true} />
        </label>
        <div className="forError">
          {errors.password && <p>min:3, max:32 symbol</p>}
        </div>
        <button>Registration</button>
      </form>
      <Link to="/">Login</Link>
    </>
  );
}
