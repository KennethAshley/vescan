import React, { Fragment } from 'react';
import { Input, Alert } from 'antd';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import VNS from 'vns-js';

import { createConnex } from '../../create-connex';

const SearchStyled = styled.div`
  flex: 1;
  margin-bottom: 32px;
`;

function Search() {
  const history = useHistory();
  const { connex } = createConnex('main');
  const vns = new VNS(connex);

  async function handleSearch(value: string) {
    value = value.toLowerCase();

    if (/^0x[0-9a-f]{40}$/i.test(value)) {
      return history.push(`/account/${value}`);

    } else if (/^0x[0-9-a-f]{64}$/i.test(value)) {
      try {
        const block = await connex.thor.block(value).get();
        if (block) {
          return history.push(`/block/${block.number}`)

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
            return history.push(`/block/${block.number}`);

          }
        } catch (err) {
          console.log(err);
        }
      }
    } else if (value.includes(".vet")) {
      const address = await vns.lookup(value.slice(0, -4));
      return history.push(`/account/${address}`);
    }
  }
  return (
    <Fragment>

      <Alert
        style={{ marginBottom: '32px' }}
        message="💀 This project is in beta. If you find any bugs please contact @Raleigh_CA on Twitter" type="info" closable />

      <SearchStyled>
        <Input.Search
          size="large"
          enterButton="Search"
          placeholder="Search blocks / tx / accounts / vns domains"
          onSearch={value => handleSearch(value)}
        />
      </SearchStyled>
    </Fragment>
  );
}

export default Search;
