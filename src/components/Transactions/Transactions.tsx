import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { truncate } from 'lodash';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { List, Card, Icon, Skeleton, Typography } from 'antd';

type Transaction = {
   id: string;
   dateTime: Date;
   clauseCount: number;
};

const IconText = ({ type, text }: any) => (
	<span>
		<Icon type={type} style={{ marginRight: 8  }} />
		{text}
	</span>
);

function formatTime(time: Date) {
  return format(new Date(time), 'HH:mm:ss');
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [itemLoading, setItemLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/transactions", {
      params: {
        page: 1,
        itemsPerPage: 20,
      }
    }).then(({ data }) => {
      setTransactions(data["hydra:member"]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const url = new URL('https://live.vexplorer.io/.well-known/mercure?topic=transaction-latest');
    //@ts-ignore
    const eventSource = new EventSource(url);

    eventSource.onmessage = ({ data }: MessageEvent) => {
      setItemLoading(true);
      const newTransaction: Transaction = JSON.parse(data);

      setTransactions(oldTransactions => {
        oldTransactions.pop()

        return [
          newTransaction,
          ...oldTransactions,
        ]
      });

      setTimeout(() => {
        setItemLoading(false);
      }, 500);
    };

    return () => {
      eventSource.close();
    };
  }, []);


  return (
    <Card title="Recent Transactions" extra={<Link to="/transactions">View All</Link>}>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={transactions}
        renderItem={(transaction: Transaction, index) => (
          <Skeleton loading={index === 0 && itemLoading} active>
            <List.Item 
              //extra={<Tag color="blue">20,1239 VET</Tag>}
              actions={[
                <IconText type="clock-circle" text={formatTime(transaction.dateTime)} key="time" />,
                <IconText type="number" text={`${transaction.clauseCount} clause(s)`} key="clauses" />
              ]}
            >
              <List.Item.Meta
                title={
                  <Typography.Text copyable={{ text: transaction.id }}>
                    <Link to={`/transaction/${transaction.id}`}>
                      { truncate(transaction.id, { 'length': 50 }) }
                    </Link>
                  </Typography.Text>
                }
              />
            </List.Item>
          </Skeleton>
        )}
      />
    </Card>
  );
}

export default Transactions;
