import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { truncate } from 'lodash';
import { format } from 'date-fns'
import { uniqueId } from 'lodash';
import { Table, Tabs, Button, Icon } from 'antd';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Address from '../../components/Address';
import Balance from '../../components/Balance';

type Transaction = {
  id: string;
}

type TokenTransfer = {
}

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const tokenTransfersColumns = [
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
    render: (text: number) => <Balance balance={text} />
  },
];

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
  //{
  //  title: 'VET',
  //  dataIndex: 'balance',
  //  key: 'balance',
  //},
  {
    title: 'Age',
    dataIndex: 'dateTime',
    key: 'age',
    render: (text: number) => formatTime(text)
  },
  {
    title: 'Block',
    dataIndex: 'blockRef',
    key: 'block',
    render: (text: string) => {
      const block = parseInt(text, 16);

      return <Link to={`/block/${block}`}>{ block }</Link>
    }
  },
  {
    title: 'From',
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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);


  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    async function getTransactions() {
      const { data } = await axios.get("https://api.vexplorer.io/transactions", {
        params: {
          page,
          itemsPerPage: 30,
        }
      });

      setLoading(false);
      setTransactions(data["hydra:member"]);
    }

    async function getTransfers() {
      const { data } = await axios.get("https://api.vexplorer.io/token_transfers", {
        params: {
          page,
          itemsPerPage: 30,
        }
      });

      setTokenTransfers(data["hydra:member"]);
    }

    getTransfers();
    getTransactions();
  }, [ page ]);

  function goBack() {
    setPage(currentPage => {
      const nextPage = currentPage - 1;

      return nextPage; 
    });
  }

  function goForward() {
    setPage(currentPage => {
      const nextPage = currentPage + 1;

      return nextPage; 
    });
  }

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
            loading={loading}
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
            loading={loading}
            dataSource={tokenTransfers}
            columns={tokenTransfersColumns}
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
