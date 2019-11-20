import React from 'react';
import { Link } from 'react-router-dom';
import { Menu as AntMenu, Icon } from 'antd';

import MenuStyled from './Menu.styled';

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

        <AntMenu.Item key="setting">
          <Link to="/">
            <Icon type="setting" />
            Testnet
          </Link>
        </AntMenu.Item>

      </AntMenu>
    </MenuStyled>
  );
}

export default Menu;
