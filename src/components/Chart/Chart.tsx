import axios from 'axios';
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { format } from 'date-fns';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import React, {
  Fragment,
  useEffect,
  useRef,
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

function formatTime(time: number | string) {
  return format(new Date(time), "LLL dd yyyy");
}

function Charts() {
  const [transactions, setTransactions] = useState(0);
  const [zoom, setZoom] = useState('1month');
  const [clauses, setClauses] = useState(0);
  const [vthoBurned, setVthoBurned] = useState({});

  const chartRef = useRef(null);

  useEffect(() => {
    let chart: any;

    axios.get("https://api.vexplorer.io/statistics/chart", {
      params: { zoom },
    }).then(({ data }) => {
      const [transactions, clauses, vthoBurned] = data.datasets;
      const formattedLabels = data.labels.map((label: string) => {
        return formatTime(label);
      });

      chart = new Chart(chartRef.current, {
        lineOptions: {
          regionFill: 1,
          hideDots: 1
        },
        isNavigable: true,
        colors: ['#1890ff', '#ffb420'],
        type: 'line',
        height: 400,
        axisOptions: {
          xIsSeries: true,
          xAxisMode: 'tick'
        },
        data: {
          labels: formattedLabels,
          datasets: [
            transactions,
            clauses
          ],
        }
      });

      setVthoBurned({
        datasets: [vthoBurned],
        labels: formattedLabels
      });

      setClauses(clauses.values[clauses.values.length - 1]);
      setTransactions(transactions.values[transactions.values.length - 1]);
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    }
  }, [ transactions, clauses, zoom ]);

  return (
    <Fragment>
      <Card
        title="Network Totals"
        style={{ marginBottom: '32px' }}
        extra={
          <Button.Group>
            <Button onClick={() => setZoom('1day')}>
              1d
            </Button>
            <Button onClick={() => setZoom('7day')}>
              7d
            </Button>
            <Button onClick={() => setZoom('1month')}>
              1m
            </Button>
            <Button onClick={() => setZoom('3month')}>
              3m
            </Button>
            <Button onClick={() => setZoom('1year')}>
              1y
            </Button>
          </Button.Group>
        }
      >
        <Statistics>
          <Statistic title="Transactions" value={transactions} prefix={<Icon type="swap" />}/>
          <Statistic title="Clauses" value={clauses} prefix={<Icon type="gold" />}/>
        </Statistics>
        <div ref={chartRef} />
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
