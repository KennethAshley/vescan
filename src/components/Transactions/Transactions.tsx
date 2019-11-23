import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { truncate } from 'lodash';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { List, Tag, Card, Icon, Typography } from 'antd';

type Transaction = {
   id: string;
   dateTime: Date;
   clauseCount: number;
};

const { Text } = Typography;

const IconText = ({ type, text }: any) => (
	<span>
		<Icon type={type} style={{ marginRight: 8  }} />
		{text}
	</span>
);

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/transactions", {
      params: {
        page: 1,
        itemsPerPage: 14
      }
    }).then(({ data }) => {
      setTransactions(data["hydra:member"]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const url = new URL('http://128.199.44.41:3000/.well-known/mercure');
    url.searchParams.append('topic', 'transaction-latest');

    //@ts-ignore
    const eventSource = new EventSource(url);

    eventSource.onmessage = ({ data }: MessageEvent) => {
      const newTransaction: Transaction = JSON.parse(data);

      setTransactions(oldTransactions => {
        oldTransactions.pop()

        return [
          newTransaction,
          ...oldTransactions,
        ]
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);


  return (
    <Card title="Recent Transactions" extra={<Link to="/transactions">Vew All</Link>}>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={transactions}
        renderItem={(transaction: Transaction) => (
          <List.Item 
            //extra={<Tag color="blue">20,1239 VET</Tag>}
            actions={[
							<IconText type="clock-circle" text={format(new Date(transaction.dateTime), "HH:mm:ss")} key="time" />,
							<IconText type="number" text={`${transaction.clauseCount} clause(s)`} key="clauses" />
            ]}
					>
            <List.Item.Meta
              title={
                <Text copyable={{ text: transaction.id }}>
                  <Link to={`/transaction/${transaction.id}`}>
                    { truncate(transaction.id, { 'length': 60 }) }
                  </Link>
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

export default Transactions;
