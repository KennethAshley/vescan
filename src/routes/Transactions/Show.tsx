import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { List, Tag, Typography, Modal, Button, Card } from 'antd';

import { createConnex } from '../../create-connex';

const { connex } = createConnex('main');

interface Meta {
  blockNumber: number;
  blockID: string;
}

interface Transaction {
  dateTime: Date | number;
  reverted: boolean;
  gasPayer: string;
  gas: number;
  origin: string;
  clauseCount: number;
  meta: Meta;
  paid: string;
  reward: string;
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
  meta: {
    blockID: "",
    blockNumber: 0
  }
};

const QRCodeWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Value = styled.span`
  margin-left: 10px;
`;


function Show() {
  const [transaction, setTransaction] = useState<Transaction[]>([initialTransaction]);
  const [receipt, setReceipt] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // @ts-ignore
  const { id } = useParams<string>();

  useEffect(() => {
    async function getTransactionData() {
      const { data } = await axios.get(`http://localhost/transactions/${id}`);
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
      }])
    })
  }, [ id ]);

  function showModal() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
  }

  return (
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
                <Value>{ parseInt(item.paid, 16) }</Value>
              </List.Item>
            }
            { item.reward &&
              <List.Item>
                <Typography.Text strong>Reward:</Typography.Text>
                <Value>{ parseInt(item.reward, 16) }</Value>
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
              <Value>{item.dateTime}</Value>
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
              <Typography.Text copyable={{ text: item.gasPayer }}>
                <Value>
                  <Link to={`/account/${item.gasPayer}`}>
                    {item.gasPayer}
                  </Link>
                </Value>
              </Typography.Text>
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
  );
};

export default Show;
