import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

import React, {
  useEffect,
  useRef,
} from 'react';

import { Card } from 'antd';

function VTHOBurned({ chart: data }: any) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      lineOptions: {
        regionFill: 1
      },
      isNavigable: true,
      colors: ['#1890ff', '#ffb420'],
      type: 'bar',
      height: 200,
      data,
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    }
  });

  return (
    <Card title="VTHO Burned">
      <div ref={chartRef} />
    </Card>
  );
}

export default VTHOBurned;
