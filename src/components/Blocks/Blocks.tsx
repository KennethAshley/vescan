import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, fromUnixTime } from 'date-fns'
import { List, Tag, Card, Icon, Skeleton, Statistic } from 'antd';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';

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

const ListItem = styled(List.Item)`
  .ant-list-item-extra {
    margin: 0 0 16px !important;
  }
`;

const Value = styled.div`
  .ant-typography  {
    align-items: center;
    display: flex;

    a {
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
    }
  }
`;

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
  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 768px)'
  });

  useEffect(() => {
    axios.get("https://api.vexplorer.io/blocks", {
      params: {
        page: 1,
        itemsPerPage: 5,
      }
    }).then(({ data }) => {
      setBlocks(data["hydra:member"]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const url = new URL('https://push.vexplorer.io:4430/events/block');
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

  function vthoBurned(gasUsed: number) {
    return ((gasUsed / 1000) * 0.7).toFixed(2);
  }

  return (
    <Card title="Recent Blocks" extra={<Link to="/blocks">View All</Link>}>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={blocks}
        renderItem={(block: Block, index) => (
          <Skeleton loading={index === 0 && itemLoading} active>
            <ListItem 
              extra={
                <Tag color="blue">
                  <IconText type="number" text={`${block.transactionCount} txn(s)`} key="transactions" />
                </Tag>
              }
              actions={[
                <IconText type="fire" text={`${vthoBurned(block.gasUsed)} VTHO Burned`} key="vtho" />,
                !isTabletOrMobile && <IconText type="clock-circle" text={formatTime(block.timestamp)} key="time" />
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
                <Fragment>
                  <div>
                    <small>Signer: </small>
                  </div>
                  { isTabletOrMobile ? (
                    <Value>
                      <Address address={block.signer} />
                    </Value>
                  ) : (
                    <Address address={block.signer} />
                  )}
                </Fragment>
            </ListItem>
          </Skeleton>
        )}
      />
    </Card>
  );
}

export default Blocks;
