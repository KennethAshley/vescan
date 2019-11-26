import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { fromUnixTime, format } from 'date-fns'
import { Table, Progress, Typography } from 'antd';
import { uniqueId } from 'lodash';
import { Helmet } from 'react-helmet';

type Block = {
  id: string
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
    render: (text: string) => (
      <Typography.Text copyable={{ text }}>
        <Link to={`/account/${text}`}>{ text }</Link>
     </Typography.Text>
    )
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
  const [total, setTotal] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/blocks", {
      params: {
        page,
        itemsPerPage: 10,
      },
    }).then(({ data }) => {
      setTotal(data["hydra:totalItems"]);
      setBlocks(data["hydra:member"]);
      setLoading(false);
    });
  }, [ page ]);

  function handleTableChange(pagination: any) {
    setPage(pagination.current);
  }

  return (
    <Fragment>
      <Helmet>
        <title>Vexplorer | Blocks</title>
      </Helmet>

      <Table
        rowKey={(record: Block) => uniqueId('block_')}
        pagination={{ total }}
        onChange={handleTableChange}
        loading={loading}
        dataSource={blocks}
        columns={columns}
      />
    </Fragment>
  );
}

export default Blocks;
