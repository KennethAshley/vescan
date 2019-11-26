import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { fromUnixTime, format } from 'date-fns'
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { uniqueId } from 'lodash';
import { Table, List, Typography, Card, Divider, Progress } from 'antd';
import { Helmet } from 'react-helmet';

interface Transaction {
  id: string;
}

interface Meta {
  blockNumber: number;
  blockID: string;
}

interface Block {
  signer: string;
  timestamp: Date | number;
  gasLimit: number;
  gasUsed: number;
};

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <Link to={`/transaction/${text}`}>{ text }</Link>
  },
  {
    title: 'VET',
    dataIndex: 'balance',
    key: 'balance',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Block',
    dataIndex: 'block',
    key: 'block',
    render: (text: string) => <Link to={`/block/${text.split('/').pop()}`}>{ text.split('/').pop() }</Link>
  },
  {
    title: 'From',
    dataIndex: 'origin',
    key: 'origin',
    render: (text: string) => <Link to={`/account/${text}`}>{ text }</Link>
  },
  {
    title: 'Clauses',
    dataIndex: 'clauseCount',
    key: 'clauses',
  }
];

const initialBlock = {
  gasLimit: 0,
  timestamp: 0,
  gasUsed: 0,
  signer: "",
};

const Value = styled.span`
  margin-left: 10px;
`;

function formatTime(time: any) {
  const date = fromUnixTime(time);
  return format(date, 'LLL dd yyyy HH:mm:ss');
}

function Show() {
  const [block, setBlock] = useState<Block[]>([initialBlock]);
  const [total, setTotal] = useState(0);
  const [blockTransactions, setBlockTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const { id } = useParams<string>();

  useEffect(() => {
    async function getBlock() {
      setLoading(true);
      const { data } = await axios.get(`https://api.vexplorer.io/blocks/${id}`);

      setBlock([{
        gasUsed: data.gasUsed,
        gasLimit: data.gasLimit,
        signer: data.signer,
        timestamp: data.timestamp
      }]);

      setLoading(false);
    };

    async function getBlockTransactions() {
      const { data } = await axios.get(`https://api.vexplorer.io/blocks/${id}/transactions`);
      setBlockTransactions(data["hydra:member"]);
      setTotal(data["hydra:totalItems"]);
    }

    getBlock()
    getBlockTransactions()
  }, [ id ]);

  return (
    <Fragment>
      <Helmet>
        <title>Vexplorer | Block</title>
      </Helmet>
      <Card
        loading={loading}
        title={
          <Typography.Text>
            Block: { id }
           </Typography.Text>
        }
      >
        <List
          dataSource={block}
          renderItem={item => (
            <Fragment>
              <List.Item>
                <Typography.Text strong>Timesamp:</Typography.Text>
                <Value>
                  {formatTime(item.timestamp)}
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Signer:</Typography.Text>
                <Value>
                  <Typography.Text copyable={{ text: item.signer }}>
                    <Link to={`/account/${item.signer}`}>{ item.signer }</Link>
                 </Typography.Text>
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Gas Used:</Typography.Text>
                <Value>
                  {item.gasUsed}
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Gas Limit:</Typography.Text>
                <Value>
                  {item.gasLimit}
                </Value>
              </List.Item>
            </Fragment>
          )}
        />
        <Divider orientation="left">Transactions</Divider>
        <Table
          rowKey={(record: Transaction) => uniqueId('transaction_')}
          pagination={{ total }}
          loading={loading}
          dataSource={blockTransactions}
          columns={columns}
        />
      </Card>
    </Fragment>
  );
};

export default Show;
