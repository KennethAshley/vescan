import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import { List, Tag, Card, Icon, Statistic } from 'antd';

type Block = {
  number: number 
  gasUsed: number
  txsFeatures: number
  timestamp: number
  transactionCount: number
  totalScore: number
};

const IconText = ({ type, text }: any) => (
	<span>
		<Icon type={type} style={{ marginRight: 8  }} />
		{text}
	</span>
);

function Blocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/blocks", {
      params: {
        page: 1,
        itemsPerPage: 10
      }
    }).then(({ data }) => {
      setBlocks(data["hydra:member"]);
      setLoading(false);
    });
  }, []);

  //useEffect(() => {
  //  const url = new URL('http://localhost:1337/.well-known/mercure');
  //  url.searchParams.append('topic', 'block-latest');
  //  //url.searchParams.append('topic', 'transaction-latest');
  //  //@ts-ignore
  //  const eventSource = new EventSource(url);

  //  eventSource.onmessage = ({ data }: MessageEvent) => {
  //    console.log(JSON.parse(data));
  //    //@ts-ignore
  //    //setBlocks(oldBlocks => [JSON.parse(data), ...oldBlocks])
  //  };

  //}, [ blocks ])

  function formatTime(time: number) {
    return format(time, 'HH:mm:ss');
  }

  return (
    <Card title="Recent Blocks" extra={<Link to="/blocks">Vew All</Link>}>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={blocks}
        renderItem={(block: Block) => (
          <List.Item 
						extra={<Tag color="blue">{block.totalScore} VET</Tag>}
            actions={[
							<IconText type="clock-circle" text={formatTime(block.timestamp)} key="time" />,
							<IconText type="number" text={`${block.transactionCount} txns`} key="transactions" />,
							<IconText type="thunderbolt" text={`${block.gasUsed} Gas`} key="gas" />,
            ]}
					>
            <List.Item.Meta
              title={
                <Statistic title="Block" value={block.number} />
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

export default Blocks;
