import React from 'react';
import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet';

import Blocks from '../components/Blocks';
import Chart from '../components/Chart';
import Stats from '../components/Stats';
import Transactions from '../components/Transactions';

const Home: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Vexplorer</title>
      </Helmet>

      <Chart />
      <Stats />
      <Row gutter={16}>
        <Col sm={24} md={24} lg={12}>
          <Blocks />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <Transactions />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
