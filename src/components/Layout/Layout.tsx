import React, { ReactNode } from 'react';
import styled from 'styled-components';

import Header from '../Header';

type LayoutProps = {
  children: ReactNode,
};

const LayoutStyled = styled.main`
  height: 100%;
`;

function Layout({ children }: LayoutProps) {
  return (
    <LayoutStyled>
      <Header />
      <div className="container">
        { children }
      </div>
    </LayoutStyled>
  );
}

export default Layout;
