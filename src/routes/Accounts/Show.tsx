import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { List, Typography, Modal, Button } from 'antd';

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

function Show() {
  const [account, setAccount] = useState<Account[]>([]);
  const [visible, setVisible] = useState(false);
  const { address } = useParams();

  useEffect(() => {
    axios.get(`http://localhost/accounts/${address}`, {
    }).then(({ data }) => {

      setAccount([{
        balance: data.balance,
        code: data.code,
        energy: data.energy,
      }])
    });
  });

  function showModal() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
  }

  return (
    <div>
      <List
        header={
          <Typography.Title level={4} copyable={{ text: address }}>
            Account: { address }
            <Button type="link" icon="qrcode" size="large" onClick={showModal} />
          </Typography.Title>
        }
        footer={<div>Footer</div>}
        bordered
        dataSource={account}
        renderItem={item => (
          <Fragment>
            <List.Item>
              <Typography.Text mark>[BALANCE]</Typography.Text> {item.balance}
            </List.Item>
            <List.Item>
              <Typography.Text mark>[ENERGY]</Typography.Text> {item.energy}
            </List.Item>
            <List.Item>
              <Typography.Text mark>[CODE]</Typography.Text> {item.code}
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
          <QRCode size={300} value="ken" />
        </QRCodeWrapper>
      </Modal>
    </div>
  );
};

export default Show;
