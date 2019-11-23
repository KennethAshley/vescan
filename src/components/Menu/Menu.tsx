import React from 'react';
import { Link } from 'react-router-dom';
import { Menu as AntMenu, Icon } from 'antd';
import styled from 'styled-components';

const MenuStyled = styled.div`
  flex: 1;
`;

function Menu() {
  return (
    <MenuStyled>
      <AntMenu mode="horizontal">

        <AntMenu.Item key="home">
          <Link to="/">
            <Icon type="home" />
            Dashboard
          </Link>
        </AntMenu.Item>

        <AntMenu.Item key="gold">
          <Link to="/blocks">
            <Icon type="gold" />
            Blocks
          </Link>
        </AntMenu.Item>

        <AntMenu.Item key="swap">
          <Link to="/transactions">
            <Icon type="swap" />
            Transactions
          </Link>
        </AntMenu.Item>

        <AntMenu.Item key="user">
          <Link to="/accounts">
            <Icon type="user" />
            Accounts
          </Link>
        </AntMenu.Item>

      </AntMenu>
    </MenuStyled>
  );
}

export default Menu;
