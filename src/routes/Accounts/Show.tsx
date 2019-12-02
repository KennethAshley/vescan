import React, { useEffect, useState, Fragment, useContext } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { useLocalStorage } from 'react-use';
import { Helmet } from 'react-helmet';
import { uniqueId } from 'lodash';
import Numeral from 'numeral';
import {
  List,
  Typography,
  Modal,
  Button,
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Divider,
} from 'antd';

import { PriceContext } from '../../contexts/Price';
import Address from '../../components/Address';
import Balance from '../../components/Balance';

type Transaction = {
  id: string;
}

type Account = {
  balance: number;
  code: boolean;
  energy: number;
}

type Token = {
  price: number;
  name: string;
  address: string;
  description: string;
  symbol: string;
};

type TokenBalance = {
  amount: number;
  token: Token;
};

const Image = styled.span`
  display: inline-block;
  margin-right: 10px;
  width: 20px;

  img {
    max-width: 100%;
  }
`;

const QRCodeWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Value = styled.span`
  margin-left: 10px;
`;

const columns = [
  {
    title: 'Token',
    dataIndex: 'token.name',
    key: 'name',
  },
  {
    title: 'From',
    dataIndex: 'fromAddress',
    key: 'from',
    render: (text: string) => <Address address={text} />
  },
  {
    title: 'To',
    dataIndex: 'toAddress',
    key: 'to',
    render: (text: string) => <Address address={text} />
  },
    {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (text: number, record: any) => {
      return (
        <Fragment>
          <Balance balance={text} />
          <small>{ Numeral(text * record.token.price).format('$0,00.00') }</small>
        </Fragment>
      );
    }
  },
];

function Show() {
  const [account, setAccount] = useState<Account[]>([]);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [tokenTransfers, setTokenTransfers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useLocalStorage<string[]>('accounts', []);
  const [saved, setSaved] = useState(false);
  const price = useContext<any>(PriceContext);
  // @ts-ignore
  const { address } = useParams<string>();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    async function getAccount() {
      const { data } = await axios.get(`https://api.vexplorer.io/accounts/${address}`);

      setAccount([{
        balance: data.balance,
        code: data.code,
        energy: data.energy,
      }]);

      setLoading(false);
    }

    async function getTokenTransfers() {
      const { data } = await axios.get(`https://api.vexplorer.io/accounts/${address}/token_transfers`);
      setTokenTransfers(data["hydra:member"]);
    }

    async function getTokenBalances() {
      const { data } = await axios.get(`https://api.vexplorer.io/accounts/${address}/token_balances`);
      setTokenBalances(data["hydra:member"]);
    }

    if (savedAccounts && savedAccounts.includes(address)) {
      setSaved(true);
    }

    getAccount();
    getTokenBalances();
    getTokenTransfers();
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
          <Address link address={address} prefix="Account" />
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
                <Typography.Text strong>VET:</Typography.Text>
                <Value>
                  <Balance balance={item.balance} price={price.vechain.usd} />
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>VTHO:</Typography.Text>
                <Value>
                  <Balance balance={item.energy} price={price['vethor-token'].usd}/>
                </Value>
              </List.Item>
              <List.Item>
                <Typography.Text strong>Contract:</Typography.Text> 
                <Value>
                  {item.code ? 'Yes' : 'No'}
                </Value>
              </List.Item>
            </Fragment>
          )}
        />

        { (tokenBalances.length > 0) && (
          <Fragment>
            <Divider>Token Balances</Divider>

            <Row gutter={24}>
              { tokenBalances.map(({ amount, token }: TokenBalance) => (
                <Col sm={12} md={6} lg={6} key={token.symbol} style={{ marginBottom: '12px' }}>
                  <Card
                    title={
                      <Fragment>
                        <Image>
                          <img
                            src={`https://raw.githubusercontent.com/vechain/token-registry/master/tokens/main/${token.address}/token.png`}
                            alt={`${token.name} icon`}
                          />
                        </Image>
                        {token.name}
                      </Fragment>
                    }
                    extra={
                      <small>{ Numeral(amount * token.price).format('$0,00.00') }</small>
                    }>
                      <Statistic value={amount} />
                  </Card>
                </Col>
              )) }
            </Row>

          </Fragment>
        )}

        { (tokenTransfers.length > 0) && (
          <Fragment>
            <Divider>Token Transfers</Divider>

            <Table
              rowKey={(record: Transaction) => uniqueId('transaction_')}
              pagination={false}
              loading={loading}
              dataSource={tokenTransfers}
              columns={columns}
            />
          </Fragment>
        )}

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
