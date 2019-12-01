import axios from 'axios';
import { format } from 'date-fns';
import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line'

import { isEmpty, last } from 'lodash';

import React, {
  Fragment,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Card,
  Col,
  Icon,
  Row,
  Statistic,
} from 'antd';

import VTHOBurned from './VTHOBurned';
import VETTransferred from './VETTransferred';
import VTHOTransferred from './VTHOTransferred';

const Statistics = styled.div`
  display: flex;
  justify-content: center;

  .ant-statistic {
    margin: 0 20px;
  }
`;

const ExtraCharts = styled.div`
  margin-bottom: 32px;

  .frappe-chart {
    .x.axis text {
      display: none;
    }
  }
`;

const Wrapper = styled.div`
  height: 400px;
`;

function formatTime(time: number | string) {
  return format(new Date(time), "LLL dd yyyy");
}

function Charts() {
  const [zoom, setZoom] = useState('1month');
  const [clauseCount, setClauseCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  const [clauses, setClauses] = useState({});
  const [transactions, setTransactions] = useState({});

  const [vthoBurned, setVthoBurned] = useState({});

  useEffect(() => {
    axios.get("https://api.vexplorer.io/statistics/chart", {
      params: { zoom },
    }).then(({ data }) => {
      const cls = data.find((item: any) => item.id === 'Clauses');
      const txs = data.find((item: any) => item.id === 'Transactions');
      const vthoB = data.find((item: any) => item.id === 'VTHO Burned');

      // @ts-ignore
      const { y: txCount } = last(txs.data);
      // @ts-ignore
      const { y: clsCount } = last(cls.data);

      setClauses(cls);
      setTransactions(txs);
      setVthoBurned(vthoB);

      setClauseCount(clsCount);
      setTransactionCount(txCount);
    });
  }, [ zoom ]);

  return (
    <Fragment>
      <Card
        title="Network Totals"
        style={{ marginBottom: '32px' }}
        extra={
          <Button.Group>
            <Button onClick={() => setZoom('7day')}>
              7d
            </Button>
            <Button onClick={() => setZoom('1month')}>
              1m
            </Button>
            <Button onClick={() => setZoom('3month')}>
              3m
            </Button>
          </Button.Group>
        }
      >
        <Statistics>
          <Statistic title="Transactions" value={transactionCount} prefix={<Icon type="swap" />}/>
          <Statistic title="Clauses" value={clauseCount} prefix={<Icon type="gold" />}/>
        </Statistics>

      <Wrapper>
        { (!isEmpty(transactions) && !isEmpty(clauses)) &&
          // @ts-ignore
          <ResponsiveLine
            data={[
              transactions,
              clauses
            ]}
            margin={{
              top: 30,
              right: 30,
              bottom: 40,
              left: 40
            }}
            yScale={{
              type: 'linear',
              stacked: true,
            }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'day',
            }}
            xFormat="time:%Y-%m-%d"
            axisBottom={{
              format: '%b %d',
              tickValues: 15,
              tickRotation: -45,
            }}
            axisTop={null}
            axisRight={null}
            axisLeft={null}
            enableArea={true}
            enablePoints={false}
            colors={[ '#1890ff', '#ffb420' ]}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableGridX={false}
            enableSlices={'x'}
            useMesh={true}
          />
        }
      </Wrapper>

      </Card>

      <ExtraCharts>
        <Row gutter={12}>
          <Col sm={24} md={8} lg={8}>
            { !isEmpty(vthoBurned) &&
              <VETTransferred chart={vthoBurned} />
            }
          </Col>
          <Col sm={24} md={8} lg={8}>
            { !isEmpty(vthoBurned) &&
              <VTHOTransferred chart={vthoBurned} />
            }
          </Col>
          <Col sm={24} md={8} lg={8}>
            { !isEmpty(vthoBurned) &&
              <VTHOBurned chart={vthoBurned} />
            }
          </Col>
        </Row>
      </ExtraCharts>
    </Fragment>
  );
}

export default Charts;
