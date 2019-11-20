import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Tabs } from 'antd';

type Transaction = {
  id: string
}

const { TabPane } = Tabs;

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <Link to={`/transaction/${text}`}>{ text }</Link>
  },
  {
    title: 'VET',
    dataIndex: 'balance',
    key: 'balance',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Block',
    dataIndex: 'block',
    key: 'block',
    render: (text: string) => text.split('/').pop(),
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

function List() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get("http://localhost/transactions", {
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
    <Tabs defaultActiveKey="1">
      <TabPane tab="Transactions" key="1">
        <Table
          rowKey={(record: Transaction) => record.id}
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
  );
}

export default List;
