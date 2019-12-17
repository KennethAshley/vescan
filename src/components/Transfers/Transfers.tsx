import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Card, Table, Input, Button, Icon } from 'antd';
import axios from 'axios';
import qs from 'qs';
import styled from 'styled-components';
import { uniqueId } from 'lodash';
import Numeral from 'numeral';

import { PriceContext } from '../../contexts/Price';

import Address from '../Address';
import Balance from '../Balance';

type TokenTransfer = {}

type Size = "default" | "small" | "middle" | undefined;

type TransfersProps = {
  size?: Size;
  amount: number;
  limit: number;
  pagination?: boolean;
  title: string;
}

Transfers.defaultProps = {
  size: "default",
  amount: 0,
  limit: 30,
}

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const { Search } = Input;
const ButtonGroup = Button.Group;

function Transfers(props: TransfersProps) {
  const price = useContext<any>(PriceContext);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number | string>(props.amount);
  const [page, setPage] = useState(1);
  const [tokenTransfers, setTokenTransfers] = useState([]);
  const { title, pagination, limit, size } = props;

  useEffect(() => {
    async function getTransfers() {
      setLoading(true);

      const { data } = await axios.get("https://api.vexplorer.io/token_transfers", {
        params: {
          page,
          amount: {
            gt: amount,
          },
          itemsPerPage: limit,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { encodeValuesOnly: true });
        },
      });

      setLoading(false);
      setTokenTransfers(data["hydra:member"]);
    }

    getTransfers();
  }, [ page, amount, limit ])

  function handleSearch(value: number | string) {
    setAmount(value)
  }

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

  function getTokenTransfersColumns(price: number) {
    return [
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
        )
      },
    ];
  };

  return (
    <Card
      title={title}
      style={{ marginBottom: '32px' }}
      extra={
        <Fragment>
          <span>
            Currently set to transfers greater than
            {` `}
            { Numeral(Number(amount)).format('0,0') }
            {` `}
            VET
          </span>
        </Fragment>
      }
    >
      <Table
        size={size}
        rowKey={(record: TokenTransfer) => uniqueId('transfer_')}
        pagination={false}
        loading={loading}
        dataSource={tokenTransfers}
        columns={getTokenTransfersColumns(price.vechain.usd)}
        footer={() => (
          <Fragment>
            { pagination && (
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
          </Fragment>
        )}
      />
    </Card>
  )
}

export default Transfers;
