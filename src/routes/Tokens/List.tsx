import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Table } from 'antd';
import { uniqueId } from 'lodash';
import { Link } from 'react-router-dom';

import Address from '../../components/Address';

type Token = {
  name: string;
  address: string;
  description: string;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text: string) => <Link to={`/token/${text}`}>{text}</Link>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text: string) => text ? <Address address={text} /> : '',
  },
  {
    title: 'Decimals',
    dataIndex: 'decimals',
    key: 'decimals',
  },
];

function List() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    axios.get(`https://api.vexplorer.io/tokens`).then(({ data }) => {
      setTokens(data['hydra:member']);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Vexplorer | Tokens</title>
      </Helmet>

      <Table
        rowKey={(record: Token) => uniqueId('token_')}
        loading={loading}
        dataSource={tokens}
        columns={columns}
        expandedRowRender={(record: Token) => <p>{record.description}</p>}
      />

    </div>
  );
}

export default List;
