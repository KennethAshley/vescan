import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table } from 'antd';

type Block = {
  id: string
};

const columns = [
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
    render: (text: string, record: any) => <Link to={`/block/${record.id}`}>{text}</Link>,
  },
  {
    title: 'Age',
    dataIndex: 'timestamp',
    key: 'age',
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
  },
  //{
  //  title: 'VTHO Reward',
  //  dataIndex: 'vtho',
  //  key: 'vtho',
  //},
  {
    title: 'Signer',
    dataIndex: 'signer',
    key: 'signer',
    render: (text: string) => <Link to={`/account/${text}`}>{ text }</Link>
  },
];

function Blocks() {
  const [total, setTotal] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get("http://localhost/blocks", {
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
    <Table
      rowKey={(record: Block) => record.id}
      pagination={{ total }}
      onChange={handleTableChange}
      loading={loading}
      dataSource={blocks}
      columns={columns}
      title={() => 'Header'}
      footer={() => 'Footer'}
    />
  );
}

export default Blocks;
