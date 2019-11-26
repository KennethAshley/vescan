import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { truncate } from 'lodash';
import { format } from 'date-fns'
import { uniqueId } from 'lodash';
import { Table, Tabs } from 'antd';
import { Helmet } from 'react-helmet';

import Address from '../../components/Address';

type Transaction = {
  id: string
}

const { TabPane } = Tabs;

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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/transactions", {
      params: {
        page,
        itemsPerPage: 10,
      },
    }).then(({ data }) => {
      setTotal(data["hydra:totalItems"]);
      setTransactions(data["hydra:member"]);
      setLoading(false);
    });
  }, [ page ]);

  function handleTableChange(pagination: any) {
    setPage(pagination.current);
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
            pagination={{ total }}
            onChange={handleTableChange}
            loading={loading}
            dataSource={transactions}
            columns={columns}
          />
        </TabPane>
        <TabPane tab="Token Transfers" key="2">
        </TabPane>
      </Tabs>
    </Fragment>
  );
}

export default List;
