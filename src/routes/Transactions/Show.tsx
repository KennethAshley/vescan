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
              <Link to={`/block/${item.meta.blockID}`}>
                { item.meta.blockNumber }
              </Link>
            </List.Item>
            <List.Item>
              <Typography.Text strong>Paid:</Typography.Text>
              {item.paid}
            </List.Item>
            <List.Item>
              <Typography.Text strong>Reward:</Typography.Text>
              {item.reward}
            </List.Item>
            <List.Item>
              <Typography.Text strong>Gas Used:</Typography.Text>
              {item.gas}
            </List.Item>
            <List.Item>
              <Typography.Text strong>Clause Count:</Typography.Text> {item.clauseCount}
            </List.Item>
            <List.Item>
              <Typography.Text strong>Timestamp:</Typography.Text> {item.dateTime}
            </List.Item>
            <List.Item>
              <div>
                <Typography.Text strong>Status:</Typography.Text>
                { item.reverted ? (
                  <Tag color="red">Failed</Tag>
                ) : (
                  <Tag color="green">Success</Tag>
                )}
              </div>
            </List.Item>
            <List.Item>
              <Typography.Text strong>Gas Payer: </Typography.Text>
              <Typography.Text copyable={{ text: item.gasPayer }}>
                <Link to={`/account/${item.gasPayer}`}>
                  {item.gasPayer}
                </Link>
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
