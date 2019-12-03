import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Descriptions } from 'antd';
import { Helmet } from 'react-helmet';

import Address from '../../components/Address';
import Balance from '../../components/Balance';

type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  price: number;
  totalSupply: number;
  volume: number;
  circulatingSupply: number;
  marketCap: number;
}

const initialToken = {
  symbol: "",
  name: "",
  address: "",
  description: "",
  decimals: 0,
  price: 0,
  totalSupply: 0,
  volume: 0,
  circulatingSupply: 0,
  marketCap: 0,
};

function Show() {
  const [token, setToken] = useState<Token>(initialToken);
  // @ts-ignore
  const { id } = useParams<string>();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    async function getToken() {
      const { data } = await axios.get(`https://api.vexplorer.io/tokens/${id}`);
      setToken(data)
    }

    getToken();
  }, [ id ]);

  return (
    <Fragment>
      <Helmet>
        <title>Vexplorer | Tokens</title>
      </Helmet>
      <Descriptions title={token.name} bordered>
        <Descriptions.Item label="Address">
          <Address address={token.address} />
        </Descriptions.Item>
        <Descriptions.Item label="Decimals">{ token.decimals }</Descriptions.Item>
        <Descriptions.Item label="Symbol">{ token.symbol }</Descriptions.Item>
        <Descriptions.Item label="Description">{ token.description }</Descriptions.Item>
        <Descriptions.Item label="Price">{ token.price }</Descriptions.Item>
        <Descriptions.Item label="Total Supply">{ token.totalSupply }</Descriptions.Item>
        <Descriptions.Item label="Volume">
          <Balance balance={token.volume} />
        </Descriptions.Item>
        <Descriptions.Item label="Circulating Supply">
          <Balance balance={token.circulatingSupply} />
        </Descriptions.Item>
        <Descriptions.Item label="Market Cap">
          <Balance balance={token.marketCap} />
        </Descriptions.Item>
      </Descriptions>
    </Fragment>
  );
};

export default Show;
