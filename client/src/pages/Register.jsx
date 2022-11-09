import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../api/axios';
import Logo from '../images/logo.png';

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error('Username should be longer than 3 characters', toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error(
        'Password should be equal or greater then 8 characters',
        toastOptions
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    console.log('first');
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password, confirmPassword } = values;

      try {
        const { data } = await axios.post('/api/auth/register', {
          username,
          email,
          password,
        });

        if (data.status === true) {
          localStorage.setItem('logged-user', JSON.stringify(data.user));
        }

        navigate('/');
      } catch (err) {
        if (!err?.response) {
          toast.error('No Server Response', toastOptions);
        } else if (err.response?.status === 409) {
          toast.error('Username Taken', toastOptions);
        } else {
          toast.error('Registration Failed', toastOptions);
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
            required
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            onChange={handleChange}
            required
          />
          <input
            type='text'
            placeholder='Password'
            name='password'
            onChange={handleChange}
            required
          />
          <input
            type='text'
            placeholder='Confirm Password'
            name='confirmPassword'
            onChange={handleChange}
            required
          />
          <button type='submit'>Create User</button>
          <span>
            Already have an account ? <Link to='/login'>Login</Link>
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

export default Register;
