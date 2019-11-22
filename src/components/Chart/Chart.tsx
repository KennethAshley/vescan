import axios from 'axios';
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { format } from 'date-fns';
import styled from 'styled-components';

import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Card,
  Icon,
  Statistic,
} from 'antd';

const Statistics = styled.div`
  display: flex;
  justify-content: center;

  .ant-statistic {
    margin: 0 20px;
  }
`;

function Charts() {
  const chartRef = useRef(null);
  const [transactions, setTransactions] = useState(0)
  const [clauses, setClauses] = useState(0)

  useEffect(() => {
    let chart: any;

    axios.get("http://localhost/statistics/chart").then(({ data }) => {
      const [transactions, clauses] = data.datasets;

      chart = new Chart(chartRef.current, {
        lineOptions: {
          regionFill: 1
        },
        isNavigable: true,
        colors: ['#1890ff', '#ffb420'],
        type: 'line',
        height: 400,
        data: {
          ...data,
          labels: data.labels.map((label: string) => {
            return format(new Date(label), "LLL dd yyyy");
          })
        },
      });

      setClauses(clauses.values[clauses.values.length - 1]);
      setTransactions(transactions.values[transactions.values.length - 1]);
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    }
  }, [ transactions, clauses ]);

  return (
    <Fragment>
      <Card
        title="Network Totals"
        style={{ marginBottom: '32px' }}
        extra={
          <Button.Group>
            <Button type="link">
              Day
            </Button>
            <Button type="link">
              Week
            </Button>
            <Button type="link">
              Month
            </Button>
            <Button type="link">
              Quarter
            </Button>
            <Button type="link">
              Year
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
    </Fragment>
  );
}

export default Charts;
