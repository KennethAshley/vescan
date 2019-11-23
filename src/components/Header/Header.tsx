import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Menu from '../Menu';

const Logo = styled.h1`
  flex: 1;
  font-family: 'Calistoga', serif;
  font-size: 2rem;
  
  a {
    color: #000000;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderStyled = styled.div`
  padding: 20px;
`;

function Header() {
  return (
    <HeaderStyled>
      <div className="container">
        <Wrapper>
          <Logo>
            <Link to="/">
              Vexplorer
            </Link>
          </Logo>
          <Menu />
        </Wrapper>
      </div>
    </HeaderStyled>
  );
}

export default Header;
