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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vet_price: 0,
    market_cap: 0,
    accounts: 0,
    volume: 0,
    blocks: 0,
  });

  useEffect(() => {
    async function getStats() {
      const { data } = await axios.get("https://api.vexplorer.io/statistics/meta");
      setStats(data);
      setLoading(false);
    }

    getStats();
  }, []);

  return (
    <StyledStats>
      <StyledCard loading={loading}>
        <Statistic title="Accounts" value={stats.accounts} prefix={<Icon type="user" />} />
      </StyledCard>
      <StyledCard loading={loading}>
        <Statistic title="Blocks" value={stats.blocks} prefix={<Icon type="gold" />} />
      </StyledCard>
      <StyledCard loading={loading}>
        <Statistic title="VET Value" value={stats.vet_price} prefix="$" precision={5} />
      </StyledCard>
      <StyledCard loading={loading}>
        <Statistic title="Market Cap" value={stats.market_cap} prefix="$" />
      </StyledCard>
      <StyledCard loading={loading}>
        <Statistic title="Trade Volume" value={stats.volume} prefix="$" />
      </StyledCard>
    </StyledStats>
  );
}

export default Stats;
