import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Table, Tabs, List as AntList, Button, Icon } from 'antd';
import { uniqueId } from 'lodash';
import { useLocalStorage } from 'react-use';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import qs from 'qs';

import Address from '../../components/Address';
import Balance from '../../components/Balance';

type Account = {
  address: string;
};

type Sort = {
  balance?: string;
  energy?: string;
}

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
    render: (text: number) => <Balance balance={text} />,
    sorter: true,
  },
  {
    title: 'VTHO',
    dataIndex: 'energy',
    key: 'energy',
    render: (text: number) => <Balance balance={text} />,
    sorter: true,
  },
  {
    title: 'Contract',
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
  const [sort, setSort] = useState<Sort>({ balance: 'desc' });

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/accounts", {
      params: {
        order: sort,
        page,
        itemsPerPage: 30,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { encodeValuesOnly: true });
      },
    }).then(({ data }) => {
      setAccounts(data["hydra:member"]);
      setLoading(false);
    });
  }, [ page, sort ]);

  function goBack() {
    setLoading(true);
    setPage(currentPage => {
      const nextPage = currentPage - 1;

      return nextPage; 
    });
  }

  function goForward() {
    setLoading(true);
    setPage(currentPage => {
      const nextPage = currentPage + 1;

      return nextPage; 
    });
  }

  function handleTableChange(...params: any) {
    const { order, field } = params[2];
    setLoading(true);

    if (order === 'ascend') {
      setSort({ [field]: 'asc' });
    } else {
      setSort({ [field]: 'desc' });
    }
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
            onChange={handleTableChange}
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
