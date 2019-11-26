import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Card, Statistic, Icon } from 'antd';

const StyledStats = styled.div`
  display: flex;
  padding-bottom: 32px;
  margin-right: -6px;
  margin-left: -6px;

  @media (max-width: 768px) {
    flex-direction: column;

    .ant-card {
      margin-bottom: 32px !important;
    }
  }
`;

const StyledCard = styled(Card)`
  flex: 1;
  margin: 0 6px !important;
`;

function Stats() {
  const [stats, setStats] = useState({
    accounts: 0,
    blocks: 0,
  });

  useEffect(() => {
    async function getStats() {
      const { data } = await axios.get("https://api.vexplorer.io/statistics/meta");
      setStats(data);
    }

    getStats();
  });

  return (
    <StyledStats>
      <StyledCard>
        <Statistic title="Accounts" value={stats.accounts} prefix={<Icon type="user" />} />
      </StyledCard>
      <StyledCard>
        <Statistic title="Blocks" value={stats.blocks} prefix={<Icon type="gold" />} />
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
