import React from 'react';
import styled from 'styled-components';

const Logo = styled.h1`
  flex: 1;
  font-family: 'Calistoga', serif;
  font-size: 2rem;
  
  a {
    color: #000000;
  }
`;

const FooterStyled = styled.div`
	height: 300px;
	margin-top: 100px;
	overflow: hidden;
`;

function Footer() {
  return (
    <FooterStyled>
      <div className="container">
      </div>
    </FooterStyled>
  );
}

export default Footer;
