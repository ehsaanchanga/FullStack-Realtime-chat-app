import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../api/axios';
import Logo from '../images/logo.png';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (localStorage.getItem('logged-user')) {
      navigate('/');
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (!username || !password) {
      toast.error('Username and password is required', toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;

      try {
        const { data } = await axios.post(
          '/api/auth/login',
          {
            username,
            password,
          },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (data.status === true) {
          localStorage.setItem('logged-user', JSON.stringify(data.user));
        }

        navigate('/');
      } catch (err) {
        if (!err?.response) {
          toast.error('No Server Response', toastOptions);
        } else if (err.response?.status === 400) {
          toast.error('Missing usrername or password', toastOptions);
        } else if (err.response?.status === 401) {
          toast.error('Invalid username or password', toastOptions);
        } else {
          toast.error('Login failed', toastOptions);
        }
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)} autoComplete='off'>
          <div className='brand'>
            <img src={Logo} alt='logo' />
            <h1>Chat-In</h1>
          </div>
          <input
            type='text'
            placeholder='Username'
            name='username'
            onChange={handleChange}
          />

          <input
            type='text'
            placeholder='Password'
            name='password'
            onChange={handleChange}
          />

          <button type='submit'>Login</button>
          <span>
            Dont have an account ? <Link to='/register'>Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
