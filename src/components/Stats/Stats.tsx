import React from 'react';
import styled from 'styled-components';
import { Card, Statistic, Icon } from 'antd';

const StyledStats = styled.div`
  display: flex;
  padding-bottom: 32px;
  margin-right: -6px;
  margin-left: -6px;
`;

const StyledCard = styled(Card)`
  flex: 1;
  margin: 0 6px !important;
`;

function Stats() {
  return (
    <StyledStats>
      <StyledCard>
        <Statistic title="Accounts" value={160456} prefix={<Icon type="user" />} />
      </StyledCard>
      <StyledCard>
        <Statistic title="Blocks" value={4671399} prefix={<Icon type="gold" />} />
      </StyledCard>
      <StyledCard>
        <Statistic title="VET Value" value={0.0061} prefix={<Icon type="dollar" />} />
      </StyledCard>
      <StyledCard>
        <Statistic title="Market Cap" value="$341,499,191" prefix={<Icon type="stock" />} />
      </StyledCard>
      <StyledCard>
        <Statistic title="Trade Volume" value="$122,629,346" prefix={<Icon type="area-chart" />} />
      </StyledCard>
    </StyledStats>
  );
}

export default Stats;
