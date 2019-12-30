import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { Typography } from 'antd';
import { Helmet } from 'react-helmet';

const Iframe = styled.iframe`
  height: 600px;
  margin-top: 32px;
  width: 100%;
`;

function Trade() {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Vexplorer | Trade</title>
      </Helmet>
      <p>Designed with simplicity in mind, Vexchange provides an interface for seamless exchange of VIP180 tokens on VeChain. By eliminating unnecessary forms of rent extraction and middlemen it allows faster, more efficient exchange. Where it makes tradeoffs, decentralization, censorship resistance, and security are prioritized.</p>
      <Typography.Text mark>
        Please note Vexchange functionality on Vexplorer does not work in Sync or the VeChain Mobile Wallet
      </Typography.Text>
        <Iframe
          frameBorder="0"
          src="https://connex.vexchange.io?widget=true&primary=1890ff&theme=light" />
      )}
    </div>
  );
}

export default Trade;
