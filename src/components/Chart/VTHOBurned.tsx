import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import Numeral from 'numeral';
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
            sliceTooltip={({ slice }: any) => {
              return (
                <div
                  style={{
                    background: 'white',
                    padding: '9px 12px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '2px'
                  }}
                >
                  {slice.points.map((point: any) => (
                    <div key={point.id}>
                      <strong
                        style={{
                          color: point.serieColor,
                          padding: '3px 0',
                        }}
                      >
                        {point.serieId}
                      </strong>
                      {" "}
                      <strong>
                        {Numeral(point.data.yFormatted).format('0,0')}
                      </strong>
                    </div>
                  ))}
                </div>
              );
            }}
        />
      </Wrapper>
    </Card>
  );
}

export default VTHOBurned;
