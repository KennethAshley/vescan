import React from 'react';
import { Input, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { createConnex } from '../../create-connex';


const SearchStyled = styled.div`
  flex: 1;
  margin-bottom: 32px;
`;

const { Option } = Select;

const selectBefore = (
  <Select defaultValue="All Filters" style={{ width: 150 }}>
    <Option value="addresses">Addresses</Option>
    <Option value="tokens">Tokens</Option>
    <Option value="Name Tags">Name Tags</Option>
    <Option value="Labels">Labels</Option>
    <Option value="Labels">Labels</Option>
  </Select>
);

function Search() {
  const history = useHistory();
  const { connex } = createConnex('main');

  async function handleSearch(value: string) {
    if (/^0x[0-9a-f]{40}$/i.test(value)) {
      return history.push(`/account/${value}`);

    } else if (/^0x[0-9-a-f]{64}$/i.test(value)) {
      try {
        const block = await connex.thor.block(value).get();
        if (block) {
          return history.push(`/block/${block.id}`)

        }
      } catch(err) {
        console.log(err);

      }

      try {
        const tx = await connex.thor.transaction(value).get();

        if (tx) {
          return history.push(`/transaction/${tx.id}`)
        }
      } catch (err) {
        console.log(err);
      }
    } else if (/^[0-9]+$/.test(value)) {
      const num = parseInt(value, 10);

      if (num < 2 ** 32) {
        try {
          const block = await connex.thor.block(num).get();

          if (block) {
            return history.push(`/block/${block.id}`);

          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  return (
    <SearchStyled>
      <Input.Search
        addonBefore={selectBefore}
        size="large"
        enterButton="Search"
        placeholder="Search blocks / tx / accounts"
        onSearch={value => handleSearch(value)}
      />
    </SearchStyled>
  );
}

export default Search;
