import React, { useEffect, useState, Fragment } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { fromUnixTime, format } from 'date-fns'
import { Table, Progress, Typography, Button, Icon } from 'antd';
import { uniqueId } from 'lodash';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Address from '../../components/Address';

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonGroup = Button.Group;

type Block = {
  id: string;
};

const columns = [
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
    render: (text: string) => <Link to={`/block/${text}`}>{text}</Link>,
  },
  {
    title: 'Age',
    dataIndex: 'timestamp',
    key: 'age',
    render: (text: number) => formatTime(text),
  },
  {
    title: 'Transactions',
    dataIndex: 'transactionCount',
    key: 'transactions',
  },
  {
    title: 'Gas Used',
    dataIndex: 'gasUsed',
    key: 'gasUsed',
    width: 200,
    render: (text: number, { gasLimit }: any) => {
      const percent = percentage(text, gasLimit);

      return (
        <Fragment>
          <Typography.Text strong>{ text }</Typography.Text>
          <small> ({percent}%)</small>
          <Progress percent={percent} size="small" showInfo={false} />
        </Fragment>
      );
    }
  },
  {
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
    key: 'gasLimit',
  },
  {
    title: 'Signer',
    dataIndex: 'signer',
    key: 'signer',
    render: (text: string) => <Address address={text} />
  },
];

function percentage(value: number, total: number) {
  return parseFloat(((value * 100) / total).toFixed(2));
}

function formatTime(time: number) {
  const date = fromUnixTime(time);
  return format(date, 'LLL dd yyyy HH:mm:ss');
}

function Blocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/blocks", {
      params: {
        page,
        itemsPerPage: 30,
      },
    }).then(({ data }) => {
      setBlocks(data["hydra:member"]);
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
        <title>Vexplorer | Blocks</title>
      </Helmet>

      <Table
        rowKey={(record: Block) => uniqueId('block_')}
        pagination={false}
        loading={loading}
        dataSource={blocks}
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
    </Fragment>
  );
}

export default Blocks;
