import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu as AntMenu, Icon } from 'antd';

function Menu() {
  const [hasConnex, setHasConnex] = useState(false);

  useEffect(() => {
    if (window.connex) {
      setHasConnex(true);
    }
  }, []);

  return (
    <div>
      <AntMenu mode="horizontal">

        <AntMenu.Item key="home">
          <NavLink to="/">
            <Icon type="home" />
            Dashboard
          </NavLink>
        </AntMenu.Item>

        <AntMenu.Item key="gold">
          <NavLink to="/blocks">
            <Icon type="gold" />
            Blocks
          </NavLink>
        </AntMenu.Item>

        <AntMenu.Item key="swap">
          <NavLink to="/transactions">
            <Icon type="swap" />
            Transactions
          </NavLink>
        </AntMenu.Item>

        <AntMenu.Item key="user">
          <NavLink to="/accounts">
            <Icon type="user" />
            Accounts
          </NavLink>
        </AntMenu.Item>

        <AntMenu.Item key="stats">
          <a href="https://vechainstats.com" target="_blank" rel="noopener noreferrer">
            <Icon type="sliders" />
            Stats
          </a>
        </AntMenu.Item>

        <AntMenu.Item key="tokens">
          <NavLink to="/tokens">
            <Icon type="user" />
            Tokens
          </NavLink>
        </AntMenu.Item>

        { hasConnex &&
          <AntMenu.Item key="trade">
            <NavLink to="trade">
              <Icon type="swap" />
              Trade
            </NavLink>
          </AntMenu.Item>
        }

      </AntMenu>
    </div>
  );
}

export default Menu;
