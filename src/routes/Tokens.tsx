import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Table } from 'antd';
import { uniqueId } from 'lodash';

import Address from '../components/Address';

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
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text: string) => <Address address={text} />
  },
  {
    title: 'Decimals',
    dataIndex: 'decimals',
    key: 'decimals',
  },
];

function Tokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://api.vexplorer.io/tokens`).then(({ data }) => {
      console.log(data);
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

export default Tokens;
