import React, { useRef, useEffect } from 'react';
import { Button, Card } from 'antd';
import styled from 'styled-components';
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const data = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      name: 'Transactions',
      values: [18, 40, 30, 35, 8, 52, 17, 4]
    },
    {
      name: 'Clauses',
      values: [30, 22, 40, 1, 20, 100, 6, 5]
    }
  ]
}

function Charts() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      lineOptions: {
        regionFill: 1
      },
      isNavigable: true,
      colors: ['#1890ff', '#ffb420'],
      type: 'line',
      height: 400,
      data: data,
    });

    return () => {
      chart.destroy();
    }
  }, []);

  return (
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
      <div ref={chartRef} />
    </Card>
  );
}

export default Charts;
