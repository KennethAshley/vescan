import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useParams } from "react-router-dom";
import { format } from 'date-fns'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { List, Tag, Typography, Modal, Button, Card, Table, Divider } from 'antd';
import { Helmet } from 'react-helmet';
import { ethers } from 'ethers';

import { createConnex } from '../../create-connex';
import Address from '../../components/Address';

const { connex } = createConnex('main');

type Meta = {
  blockNumber: number;
  blockID: string;
}

type Clauses = {
  data: string;
  to: string;
}

type Transaction = {
  dateTime: Date | number;
  reverted: boolean;
  gasPayer: string;
  gas: number;
  origin: string;
  clauseCount: number;
  meta: Meta;
  paid: string;
  reward: string;
  clauses: Clauses[];
};

const initialTransaction = {
  dateTime: 0,
  paid: "",
  reward: "",
  gasPayer: "",
  gas: 0,
  origin: "",
  clauseCount: 0,
  reverted: false,
  clauses: [
    {
      to: "",
      data: ""
    }
  ],
  meta: {
    blockID: "",
    blockNumber: 0
  },
};

const columns = [
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
  },
];

const QRCodeWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Value = styled.span`
  margin-left: 10px;
`;


function formatWei(hex: string) {
  const wei = ethers.utils.bigNumberify(hex);
  return ethers.utils.formatEther(wei);
}

function formatTime(time: any) {
  return format(new Date(time), 'LLL dd yyyy HH:mm:ss');
}

function Show() {
  const [transaction, setTransaction] = useState<Transaction[]>([initialTransaction]);
  //const [receipt, setReceipt] = useState();
  const [visible, setVisible] = useState(false);
  //const [loading, setLoading] = useState(true);

  // @ts-ignore
  const { id } = useParams<string>();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    async function getTransactionData() {
      const { data } = await axios.get(`https://api.vexplorer.io/transactions/${id}`);
        console.log(data)
      return data;
    };

    async function getReceipt() {
      const tx = await connex.thor.transaction(id);
      const receipt = await tx.getReceipt();

      return receipt;
    }

    Promise.all([
      getTransactionData(),
      getReceipt()
    ]).then(([data, receipt]) => {
      setTransaction([{
        ...data,
        ...receipt,
      }]);
    })
  }, [ id ]);

  function showModal() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
  }

  return (
    <Fragment>
      <Helmet>
        <title>Vexplorer | Transaction</title>
      </Helmet>
      <Card
        title={
          <Typography.Text copyable={{ text: id }}>
            Transaction: { id }
           </Typography.Text>
        }
        extra={
          <Fragment>
            <Button type="link" icon="qrcode" size="large" onClick={showModal} />
          </Fragment>
        }
      >
        <List
          dataSource={transaction}
          renderItem={item => (
            <Fragment>
              <List.Item>
                <Typography.Text strong>Block Number:</Typography.Text>
                <Link to={`/block/${item.meta.blockNumber}`}>
                  <Value>
                    { item.meta.blockNumber }
                  </Value>
                </Link>
              </List.Item>
              { item.paid &&
                <List.Item>
                  <Typography.Text strong>Paid:</Typography.Text>
                  <Value>
                    { formatWei(item.paid) }
                  </Value>
                </List.Item>
              }
              { item.reward &&
                <List.Item>
                  <Typography.Text strong>Reward:</Typography.Text>
                  <Value>
                    { formatWei(item.reward) }
                  </Value>
                </List.Item>
              }
              <List.Item>
                <Typography.Text strong>Gas Used:</Typography.Text>
                <Value>{item.gas}</Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Clause Count:</Typography.Text>
                <Value>{item.clauseCount}</Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Timestamp:</Typography.Text>
                <Value>
                  {formatTime(item.dateTime)}
                </Value>
              </List.Item>
              <List.Item>
                <div>
                  <Typography.Text strong>Status:</Typography.Text>
                  <Value>
                    { item.reverted ? (
                      <Tag color="red">Failed</Tag>
                    ) : (
                      <Tag color="green">Success</Tag>
                    )}
                  </Value>
                </div>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Gas Payer: </Typography.Text>
                <Value>
                  <Address address={item.gasPayer} />
                </Value>
              </List.Item>
              <Divider>Clauses</Divider>
              <List.Item>
                <Table
                  columns={columns}
                  style={{ width: '100%' }}
                  dataSource={item.clauses}
                  expandedRowRender={record => (
                    <Fragment>
                      <div>Data: </div>
                      <Typography.Text style={{ margin: 0, wordBreak: 'break-all' }}>
                        {record.data}
                      </Typography.Text>
                    </Fragment>
                  )}
                />
              </List.Item>
            </Fragment>
          )}
        />
        <Modal
          visible={visible}
          onOk={closeModal}
          onCancel={closeModal}
        >
          <QRCodeWrapper>
            <QRCode size={300} value={id} />
          </QRCodeWrapper>
        </Modal>
      </Card>
    </Fragment>
  );
};

export default Show;
