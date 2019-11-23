import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Tabs, List as AntList } from 'antd';
import { uniqueId } from 'lodash';
import { useLocalStorage } from 'react-use';

type Account = {
  address: string
};

const { TabPane } = Tabs;

const accountTableColumns = [
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
  const [savedAccounts] = useLocalStorage<String[]>('accounts');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/accounts", {
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
    setLoading(true);
    setPage(pagination.current);
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="All Accounts" key="1">
        <Table
          rowKey={(record: Account) => uniqueId('account_')}
          pagination={{ total }}
          onChange={handleTableChange}
          loading={loading}
          dataSource={accounts}
          columns={accountTableColumns}
        />
      </TabPane>
      <TabPane tab="Favorites" key="2">
        <AntList
          dataSource={savedAccounts}
          renderItem={item => (
            <AntList.Item>
              <Link to={`/account/${item}`}>
                { item }
              </Link>
            </AntList.Item>
          )}
        />
      </TabPane>
      <TabPane tab="Authority" key="3">
      </TabPane>
    </Tabs>
  );
}

export default List;
