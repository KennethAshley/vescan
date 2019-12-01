import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { fromUnixTime, format } from 'date-fns'
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { uniqueId } from 'lodash';
import { Table, List, Typography, Card, Divider } from 'antd';
import { Helmet } from 'react-helmet';

import Address from '../../components/Address';

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
    title: 'Timestamp',
    dataIndex: 'dateTime',
    key: 'datetime',
    render: (text: Date) => format(new Date(text), "LLL dd yyyy HH:mm:ss"),
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
  const [blockTransactions, setBlockTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const { id } = useParams<string>();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

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
                  <Address address={item.signer} />
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
        <Divider>Transactions</Divider>
        <Table
          rowKey={(record: Transaction) => uniqueId('transaction_')}
          pagination={false}
          loading={loading}
          dataSource={blockTransactions}
          columns={columns}
        />
      </Card>
    </Fragment>
  );
};

export default Show;
