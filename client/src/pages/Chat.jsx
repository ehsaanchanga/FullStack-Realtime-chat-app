import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../api/axios';
import ChatContainer from '../components/ChatContainer';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import { io } from 'socket.io-client';

const REACT_APP_BACKEND_HOST = 'http://localhost:5000';

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem('logged-user')) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('logged-user')));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(REACT_APP_BACKEND_HOST);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getAllUsers = async () => {
      if (currentUser.isAvatarImageSet) {
        const { data } = await axios.get(
          `/api/auth/all-users/${currentUser._id}`,
          {
            signal: controller.signal,
          }
        );
        isMounted && setContacts(data);
      } else {
        navigate('/set-avatar');
      }
    };
    if (currentUser) {
      getAllUsers();
    }

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className='container'>
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {currentUser && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #8b8b98;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #544c4c76;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat;
