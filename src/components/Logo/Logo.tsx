import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from './logo.png';

const Wrapper = styled.div`
  width: 50px;

  img {
    max-width: 100%;
  }
`;

function Logo() {
  return (
    <Link to="/">
      <Wrapper>
        <img src={logo} alt="vexplorer logo" />
      </Wrapper>
    </Link>
  );
}

export default Logo;
