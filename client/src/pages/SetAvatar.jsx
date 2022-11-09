import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../api/axios';
import { Buffer } from 'buffer';

const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4645646`;

  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (!localStorage.getItem('logged-user')) navigate('/login');
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar', toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem('logged-user'));

      try {
        const { data } = await axios.post(`/api/auth/set-avatar/${user._id}`, {
          image: avatars[selectedAvatar],
        });
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('logged-user', JSON.stringify(user));
        navigate('/');
      } catch (error) {
        toast.error(
          'Error while seting avatar image, Please try again',
          toastOptions
        );
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const getAvatarImages = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`,
          {
            signal: controller.signal,
          }
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString('base64'));
      }

      setAvatars(data);
      setIsLoading(false);
    };
    getAvatarImages();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          {/* <img src={loader} alt="loader" className="loader" /> */}
          <h1>Loading ....</h1>
        </Container>
      ) : (
        <Container>
          <div className='title-container'>
            <h1>Pick an Avatar for your profile picture</h1>
          </div>
          <div className='avatars'>
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? 'selected' : ''
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt='avatar'
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className='submit-btn'>
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;

export default SetAvatar;
