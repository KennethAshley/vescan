import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

import React, {
  useEffect,
  useRef,
} from 'react';

import { Card } from 'antd';

function VTHOTransferred({ chart: data }: any) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      lineOptions: {
        regionFill: 1
      },
      isNavigable: true,
      colors: ['#d3d3d3'],
      type: 'line',
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
    <Card title="VTHO Transferred">
      <div ref={chartRef} />
    </Card>
  );
}

export default VTHOTransferred;
