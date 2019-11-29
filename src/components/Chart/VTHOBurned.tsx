import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';

const Wrapper = styled.div`
  height: 200px;
`;

function VTHOBurned({ chart: data }: any) {
  return (
    <Card title="VTHO Burned">
      <Wrapper>
        <ResponsiveLine
          data={[
            data
          ]}
          margin={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }}
          yScale={{
            type: 'linear',
            stacked: true,
          }}
          axisTop={null}
          axisRight={null}
          axisLeft={null}
          enableArea={true}
          colors={[ '#1890ff' ]}
          enableGridX={false}
          pointSize={1}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          axisBottom={null}
          enableSlices={'x'}
          useMesh={true}
        />
      </Wrapper>
    </Card>
  );
}

export default VTHOBurned;
