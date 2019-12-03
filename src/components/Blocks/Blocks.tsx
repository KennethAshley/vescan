import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, fromUnixTime } from 'date-fns'
import { List, Tag, Card, Icon, Skeleton, Statistic } from 'antd';
import Numeral from 'numeral';

import Address from '../Address';

type Block = {
  loading: boolean;
  number: number;
  gasUsed: number;
  txsFeatures: number;
  timestamp: number;
  transactionCount: number;
  signer: string; 
};

const IconText = ({ type, text }: any) => (
	<span>
		<Icon type={type} style={{ marginRight: 8  }} />
		{text}
	</span>
);

function Blocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [itemLoading, setItemLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api.vexplorer.io/blocks", {
      params: {
        page: 1,
        itemsPerPage: 10,
      }
    }).then(({ data }) => {
      setBlocks(data["hydra:member"]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const url = new URL('https://live.vexplorer.io/.well-known/mercure?topic=block-latest');
    //@ts-ignore
    const eventSource = new EventSource(url);

    eventSource.onmessage = ({ data }: MessageEvent) => {
      setItemLoading(true);
      let newBlock: Block = JSON.parse(data);
      newBlock = { loading: true, ...newBlock };

      setBlocks(oldBlocks => {
        oldBlocks.pop()

        return [
          newBlock,
          ...oldBlocks,
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

  function formatTime(time: number) {
    const date = fromUnixTime(time);
    return format(date, 'HH:mm:ss');
  }

  return (
    <Card title="Recent Blocks" extra={<Link to="/blocks">View All</Link>}>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={blocks}
        renderItem={(block: Block, index) => (
          <Skeleton loading={index === 0 && itemLoading} active>
            <List.Item 
              extra={
                <Tag color="blue">
                  <IconText type="number" text={`${block.transactionCount} txn(s)`} key="transactions" />
                </Tag>
              }
              actions={[
                <IconText type="clock-circle" text={formatTime(block.timestamp)} key="time" />,
                <IconText type="thunderbolt" text={`${Numeral(block.gasUsed).format('0,0')} Gas`} key="gas" />,
              ]}
            >
              <List.Item.Meta
                title={
                  <Fragment>
                    <Link to={`/block/${block.number}`}>
                      <Statistic
                        title="Block"
                        value={block.number}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<Icon type="gold" />}
                      />
                    </Link>
                  </Fragment>
                }
              />
              <div>
                <small>Signer: </small>
              </div>
              <Address address={block.signer} />
            </List.Item>
          </Skeleton>
        )}
      />
    </Card>
  );
}

export default Blocks;
