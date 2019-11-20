import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Tabs } from 'antd';

type Account = {
  address: string
};

const { TabPane } = Tabs;

const columns = [
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text: string) => <Link to={`/account/${text}`}>{ text }</Link>
  },
  {
    title: 'VET',
    dataIndex: 'balance',
    key: 'balance',
  },
  {
    title: 'VTHO',
    dataIndex: 'energy',
    key: 'energy',
  },
  {
    title: 'Has Code',
    dataIndex: 'code',
    key: 'code',
  },
];

function List() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get("http://localhost/accounts", {
      params: {
        page,
        itemsPerPage: 10,
      },
    }).then(({ data }) => {
      setTotal(data["hydra:totalItems"]);
      setAccounts(data["hydra:member"]);
      setLoading(false);
    });
  }, [ page ]);

  function handleTableChange(pagination: any) {
    setPage(pagination.current);
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="All Accounts" key="1">
        <Table
          rowKey={(record: Account) => record.address}
          pagination={{ total }}
          onChange={handleTableChange}
          loading={loading}
          dataSource={accounts}
          columns={columns}
        />
      </TabPane>
      <TabPane tab="Favorites" key="2">
      </TabPane>
      <TabPane tab="Authority" key="3">
      </TabPane>
    </Tabs>
  );
}

export default List;
