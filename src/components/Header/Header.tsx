import React from 'react';
import styled from 'styled-components';

import Menu from '../Menu';
import Logo from '../Logo';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;

    .ant-menu-vertical {
      border-right: none;
    }
  }
`;

const HeaderStyled = styled.div`
  padding: 20px;
  margin-bottom: 20px;
`;

function Header() {
  return (
    <HeaderStyled>
      <div className="container">
        <Wrapper>
          <Logo />
          <Menu />
        </Wrapper>
      </div>
    </HeaderStyled>
  );
}

export default Header;
