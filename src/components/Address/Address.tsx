import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';

import { addresses } from '../../constants/known.json';

type AddressProps = {
  address: string;
  link?: boolean;
  prefix?: string;
}

type Address = {
  label: string;
  address: string;
}

function Address({ address, link = true, prefix }: AddressProps) {
  const [knownAddress, setKnownAddress] = useState<Address | undefined>();

  useEffect(() => {
    const known = addresses.find(item => item.address === address);

    setKnownAddress(known);
  }, [ address ]);

  return (
    <Typography.Text copyable={{ text: address }}>
      { knownAddress &&
        <div>
          <small>{ knownAddress.label }</small>
        </div>
      }
      { link ? (
        <Link to={`/account/${address}`}>{ address }</Link>
      ) : (
        { address }
      )}
   </Typography.Text>
  )
}

export default Address;
