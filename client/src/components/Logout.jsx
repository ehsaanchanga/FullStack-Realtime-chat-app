import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiPowerOff } from 'react-icons/bi';
import styled from 'styled-components';

const Logout = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Button onClick={handleClick}>
      <h3>Logout</h3>
      <BiPowerOff />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;

  h3,
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default Logout;
