import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { List, Typography, Modal, Button, Card  } from 'antd';
import { useLocalStorage } from 'react-use';
import { Helmet } from 'react-helmet';

type Account = {
  balance: number;
  code: boolean;
  energy: number;
}

const QRCodeWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Value = styled.span`
  margin-left: 10px;
`;

function Show() {
  const [account, setAccount] = useState<Account[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useLocalStorage<string[]>('accounts', []);
  const [saved, setSaved] = useState(false);
  // @ts-ignore
  const { address } = useParams<string>();

  useEffect(() => {
    axios.get(`https://api.vexplorer.io/accounts/${address}`).then(({ data }) => {
      setAccount([{
        balance: data.balance,
        code: data.code,
        energy: data.energy,
      }]);

    });

    if (savedAccounts && savedAccounts.includes(address)) {
      setSaved(true);
    }

    setLoading(false);
  }, [ savedAccounts, address ]);

  function showModal() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
  }

  function save() {
    let previousAccounts = savedAccounts;
    let addresses: Set<string> = new Set(previousAccounts)

    addresses.add(address);

    setSavedAccounts(oldAddresses => ([
      ...oldAddresses,
      ...Array.from(addresses),
    ]));
  }

  return (
    <Fragment>
      <Helmet>
        <title>Vexplorer | Account</title>
      </Helmet>
      <Card
        title={
          <Typography.Text copyable={{ text: address }}>
            Account: { address }
           </Typography.Text>
        }
        extra={
          <Fragment>
            <Button type="link" icon="qrcode" size="large" onClick={showModal} />
            { saved ? (
              <Button disabled type="link" icon="star" size="large" onClick={save} />
            ) : (
              <Button type="link" icon="star" size="large" onClick={save} />
            ) }
          </Fragment>
        }
      >
        <List
          loading={loading}
          dataSource={account}
          renderItem={item => (
            <Fragment>
              <List.Item>
                <Typography.Text strong>Balance:</Typography.Text>
                <Value>
                  {item.balance}
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Energy:</Typography.Text>
                <Value>
                  {item.energy}
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Has Code:</Typography.Text> 
                <Value>
                  {item.code}
                </Value>
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
            <QRCode size={300} value={address} />
          </QRCodeWrapper>
        </Modal>
      </Card>
    </Fragment>
  );
};

export default Show;
