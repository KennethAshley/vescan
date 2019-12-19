import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';
import { format } from 'date-fns';
import Numeral from 'numeral';

const Wrapper = styled.div`
  height: 200px;
`;

function formatDate(date: Date) {
  return format(new Date(date), 'MMM dd yyyy');
}

function VETTransferred({ chart: data }: any) {
  return (
    <Card title="VET Transferred">
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
          pointSize={1}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          axisBottom={null}
          enableGridX={false}
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
                <strong>
                  { formatDate(slice.points[0].data.xFormatted) }
                </strong>
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

export default VETTransferred;
