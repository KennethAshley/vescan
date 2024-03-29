import React, { useEffect, useState } from 'react';
import axios from 'axios';

type PriceProps = {
  children: JSX.Element;
}

export const PriceContext = React.createContext(0);

const initialPrices = {
  vechain: {
    usd: 0,
  },
  'vethor-token': {
    usd: 0,
  },
};

function PriceProvider({ children }: PriceProps) {
  const [ prices, setPrices ] = useState(initialPrices);

  useEffect(() => {
    async function getPrice() {
      const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=vechain%2Cvethor-token&vs_currencies=usd');

      setPrices({ ...data });
    }

    getPrice();
  }, []);

  return (
    // @ts-ignore
    <PriceContext.Provider value={prices}>
      { children }
    </PriceContext.Provider>
  );
}

export default PriceProvider;
