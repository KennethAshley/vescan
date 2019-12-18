import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  .container {
    margin: 0 auto;
    max-width: 1280px;
  }

  @media (max-width: 768px) {
    .ant-table {
      display: inline-block;
      vertical-align: top;
      max-width: 100%;
    
      overflow-x: auto;
    
      white-space: nowrap;

      border-collapse: collapse;
      border-spacing: 0;
    }

    .ant-card-head-wrapper {
      flex-direction: column;
    }
  }
`;

