import React from 'react';
import { Row, Col } from 'antd';

import Blocks from '../components/Blocks';
import Chart from '../components/Chart';
import Stats from '../components/Stats';
import Transactions from '../components/Transactions';

const Home: React.FC = () => {
  return (
    <div>
      <Chart />
      <Stats />
      <Row gutter={16}>
        <Col span={12}>
          <Blocks />
        </Col>
        <Col span={12}>
          <Transactions />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
