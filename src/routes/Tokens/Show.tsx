import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Descriptions, Badge } from 'antd';
import { Helmet } from 'react-helmet';
import { ethers } from 'ethers';

import { createConnex } from '../../create-connex';
import Address from '../../components/Address';

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
    async function getToken() {
      const { data } = await axios.get(`https://api.vexplorer.io/tokens/${id}`);
      setToken(data)
    }

    getToken();
  }, [ id ]);
  return (
    <Descriptions title={token.name} bordered>
      <Descriptions.Item label="Address">
        <Address address={token.address} />
      </Descriptions.Item>
      <Descriptions.Item label="Decimals">{ token.decimals }</Descriptions.Item>
      <Descriptions.Item label="Symbol">{ token.symbol }</Descriptions.Item>
      <Descriptions.Item label="Description">{ token.description }</Descriptions.Item>
      <Descriptions.Item label="Price">{ token.price }</Descriptions.Item>
      <Descriptions.Item label="Total Supply">{ token.totalSupply }</Descriptions.Item>
      <Descriptions.Item label="Volume">{ token.volume }</Descriptions.Item>
      <Descriptions.Item label="Circulating Supply">{ token.circulatingSupply }</Descriptions.Item>
      <Descriptions.Item label="Market Cap">{ token.marketCap }</Descriptions.Item>
    </Descriptions>
  );
};

export default Show;
