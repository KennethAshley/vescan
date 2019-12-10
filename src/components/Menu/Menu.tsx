import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ResponsiveAntMenu from 'responsive-ant-menu';
import { Menu as AntMenu, Icon, Button } from 'antd';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';

const Wrapper = styled.div`
  @media (max-width: 768px) {
    margin-top: 32px;
  }
`;

const AntMenuStyled = styled(AntMenu)`
  @media (max-width: 768px) {
    border-right: none !important;
  }
`;

function Menu() {
  const [hasConnex, setHasConnex] = useState(false);
  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 768px)'
  });

  useEffect(() => {
    if (window.connex) {
      setHasConnex(true);
    }
  }, []);

  return (
    <Wrapper>
			<ResponsiveAntMenu
				activeLinkKey={window.location.pathname}
        mobileMenuContent={(isMenuShown: boolean) => isMenuShown ? (
          <Button icon="close" />
        ) : (
          <Button icon="menu" />
        )}
				menuClassName={'responsive-ant-menu'}
        mode={isTabletOrMobile ? "vertical" : "horizontal"}
			>
        {() => (
          <AntMenuStyled mode="horizontal">
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
					</AntMenuStyled>
        )}
      </ResponsiveAntMenu>
    </Wrapper>
  );
}

export default Menu;
