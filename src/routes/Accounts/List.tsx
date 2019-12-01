import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Table, Tabs, List as AntList, Button, Icon } from 'antd';
import { uniqueId } from 'lodash';
import { useLocalStorage } from 'react-use';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Address from '../../components/Address';
import Balance from '../../components/Balance';

type Account = {
  address: string
};

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

const columns = [
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (text: string) => <Address address={text} />
  },
  {
    title: 'VET',
    dataIndex: 'balance',
    key: 'balance',
    render: (text: number) => <Balance balance={text} />
  },
  {
    title: 'VTHO',
    dataIndex: 'energy',
    key: 'energy',
    render: (text: number) => <Balance balance={text} />
  },
  {
    title: 'Has Code',
    dataIndex: 'code',
    key: 'code',
    render: (text: string) => text ? 'True' : 'False',
  },
];

function List() {
  const [savedAccounts] = useLocalStorage<String[]>('accounts');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/accounts", {
      params: {
        page,
        itemsPerPage: 30,
      },
    }).then(({ data }) => {
      setAccounts(data["hydra:member"]);
      setLoading(false);
    });
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
        <title>Vexplorer | Accounts</title>
      </Helmet>
      <Tabs defaultActiveKey="1">
        <TabPane tab="All Accounts" key="1">
          <Table
            rowKey={(record: Account) => uniqueId('account_')}
            pagination={false}
            loading={loading}
            dataSource={accounts}
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
        <TabPane tab="Favorites" key="2">
          <AntList
            dataSource={savedAccounts}
            renderItem={(item: any) => (
              <AntList.Item>
                <Address address={item} />
              </AntList.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Authority" key="3">
        </TabPane>
      </Tabs>
    </Fragment>
  );
}

export default List;
