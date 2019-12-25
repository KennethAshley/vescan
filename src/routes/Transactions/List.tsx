import React, { useEffect, useState, Fragment, useContext } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { truncate } from 'lodash';
import { format } from 'date-fns'
import { uniqueId } from 'lodash';
import { Table, Tabs, Button, Icon, Input, Select } from 'antd';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import qs from 'qs';

import { PriceContext } from '../../contexts/Price';

import Address from '../../components/Address';
import Balance from '../../components/Balance';

type Transaction = {
  id: string;
}

type TokenTransfer = {
}

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => {
      return (
        <Link to={`/transaction/${text}`}>
          { truncate(text, { 'length': 50 }) }
        </Link>
      );
    }
  },
  {
    title: 'Age',
    dataIndex: 'dateTime',
    key: 'age',
    render: (text: number) => formatTime(text)
  },
  {
    title: 'Origin',
    dataIndex: 'origin',
    key: 'origin',
    render: (text: string) => <Address address={text} />
  },
  {
    title: 'Clauses',
    dataIndex: 'clauseCount',
    key: 'clauses',
  }
];

function formatTime(time: number) {
  return format(new Date(time), 'LLL dd yyyy HH:mm:ss');
}

function List() {
  const [transactions, setTransactions] = useState([]);
  const [tokenTransfers, setTokenTransfers] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transfersLoading, setTransfersLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState<number | string>(0);
  const [tokens, setTokens] = useState([]);
  const price = useContext<any>(PriceContext);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    async function getTransactions() {
      setTransactionsLoading(true);

      const { data } = await axios.get("https://api.vexplorer.io/transactions", {
        params: {
          page,
          itemsPerPage: 30,
        },
      });

      setTransactionsLoading(false);
      setTransactions(data["hydra:member"]);
    }

    async function getTransfers() {
      setTransfersLoading(true);

      const { data } = await axios.get("https://api.vexplorer.io/token_transfers", {
        params: {
          page,
          amount: {
            gt: amount,
          },
          'token.symbol': tokens,
          itemsPerPage: 30,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { encodeValuesOnly: true });
        },
      });

      setTransfersLoading(false);
      setTokenTransfers(data["hydra:member"]);
    }

    getTransfers();
    getTransactions();
  }, [ page, amount, tokens ]);

  function goBack() {
    setPage(currentPage => {
      const nextPage = currentPage - 1;

      return nextPage; 
    });
  }

  function handleSearch(value: number | string) {
    setAmount(value);
  }

  function handleSelect(value: any) {
    setTokens(value);
  }

  function goForward() {
    setPage(currentPage => {
      const nextPage = currentPage + 1;

      return nextPage; 
    });
  }

  function getTokenTransfersColumns(price: number) {
    return [
      {
        title: 'Token',
        dataIndex: 'token.name',
        key: 'name',
        filters: [
          {
            text: 'Joe',
            value: 'Joe',
          }
        ],
        filterDropdown: () => (
          <div style={{ padding: 8 }}>
            <Select
              showSearch
              style={{ width: 400 }}
              mode="multiple"
              placeholder="Select a token"
              onChange={handleSelect}
            >
              <Option value="VET">VET</Option>
              <Option value="VTHO">VTHO</Option>
              <Option value="OCE">OCE</Option>
              <Option value="SHA">SHA</Option>
              <Option value="PLA">PLA</Option>
              <Option value="DBET">DBET</Option>
              <Option value="EHRT">EHRT</Option>
              <Option value="HAI">HAI</Option>
              <Option value="AQD">AQD</Option>
              <Option value="JUR">JUR</Option>
              <Option value="SNKr">SNK</Option>
              <Option value="BAG">BAG</Option>
              <Option value="STAR">STAR</Option>
              <Option value="YEET">YEET</Option>
            </Select>
          </div>
        ),
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
        render: (text: number) => <Balance balance={text} price={price} />,
        filterDropdown: () => (
          <div style={{ padding: 8 }}>
            <Search
              type="number"
              onSearch={handleSearch}
              enterButton="Search"
              placeholder="Filter Large Transactions"
              style={{ width: 300, display: 'block' }}
            />
          </div>
        ),
      },
    ];
  };

  return (
    <Fragment>
      <Helmet>
        <title>Vexplorer | Transactions</title>
      </Helmet>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Transactions" key="1">
          <Table
            rowKey={(record: Transaction) => uniqueId('transaction_')}
            pagination={false}
            loading={transactionsLoading}
            dataSource={transactions}
            columns={columns}
            footer={() => (
              <Pagination>
                <ButtonGroup>
                  <Button type="primary" onClick={() => goBack()}>
                    <Icon type="left" />
                    Previous Page
                  </Button>
                  <Button type="primary" onClick={() => goForward()}>
                    Next Page
                    <Icon type="right" />
                  </Button>
                </ButtonGroup>
            </Pagination>
          )}
        />
        </TabPane>
        <TabPane tab="Token Transfers" key="2">
          <Table
            rowKey={(record: TokenTransfer) => uniqueId('transfer_')}
            pagination={false}
            loading={transfersLoading}
            dataSource={tokenTransfers}
            columns={getTokenTransfersColumns(price.vechain.usd)}
            footer={() => (
              <Pagination>
                <ButtonGroup>
                  <Button type="primary" onClick={() => goBack()}>
                    <Icon type="left" />
                    Previous Page
                  </Button>
                  <Button type="primary" onClick={() => goForward()}>
                    Next Page
                    <Icon type="right" />
                  </Button>
                </ButtonGroup>
            </Pagination>
          )}
        />
        </TabPane>
      </Tabs>
    </Fragment>
  );
}

export default List;
