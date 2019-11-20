import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { List, Tag, Card, Icon, Typography } from 'antd';

type Transaction = {
   id: string
};

const { Text } = Typography;

const IconText = ({ type, text }: any) => (
	<span>
		<Icon type={type} style={{ marginRight: 8  }} />
		{text}
	</span>
);

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/transactions", {
      params: {
        page: 1,
        itemsPerPage: 9
      }
    }).then(({ data }) => {
      setTransactions(data["hydra:member"]);
      setLoading(false);
    });
  }, []);

  return (
    <Card title="Recent Transactions" extra={<Link to="/transactions">Vew All</Link>}>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={transactions}
        renderItem={(transaction: Transaction) => (
          <List.Item 
						extra={<Tag color="blue">20,1239 VET</Tag>}
            actions={[
							<IconText type="clock-circle" text="28 secs ago" key="time" />
            ]}
					>
            <List.Item.Meta
              title={
                <Text copyable={{ text: transaction.id }}>
                  <Link to={`/transaction/${transaction.id}`}>
                    { truncate(transaction.id, { 'length': 40 }) }
                  </Link>
                </Text>
              }
            />
            <div>
              <div>
                From: 
                {" "}
                <Text copyable={{ text: transaction.id }}>
                  <Link to={`/account`}>
                    0x15bccf377f1a9bbd0cd8e24d031c9451326f29a0
                  </Link>
                </Text>
              </div>
              <div>
                To:
                {" "}
                <Text copyable={{ text: transaction.id }}>
                  <Link to={`/account`}>
                    0x15bccf377f1a9bbd0cd8e24d031c9451326f29a0
                  </Link>
                </Text>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}

export default Transactions;
