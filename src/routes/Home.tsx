import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Row, Col } from 'antd';
import { Helmet } from 'react-helmet';

import Blocks from '../components/Blocks';
import Chart from '../components/Chart';
import Stats from '../components/Stats';
import Transactions from '../components/Transactions';
import Transfers from '../components/Transfers';

function Home() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Vexplorer</title>
      </Helmet>

      <Chart />
      <Stats />
      <Transfers
        limit={10}
        amount={1000000}
        title="Large Transfers"
        pagination={false}
      />
      <Row gutter={16}>
        <Col sm={24} md={24} lg={12}>
          <Blocks />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <Transactions />
        </Col>
      </Row>
    </div>
  )
}

export default Home;
