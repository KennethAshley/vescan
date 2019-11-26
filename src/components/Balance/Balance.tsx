import React from 'react';
import Numeral from 'numeral';

type BalanceProps = {
  balance: number;
  suffix?: string;
  price?: number;
}

function Balance({ balance, suffix, price }: BalanceProps) {
  return (
    <div>
      { Numeral(balance).format('0,0') }
      { price &&
        <span>
          { " " }
          ({ Numeral(balance * price).format('$0,00.00') })
        </span>
      }
      { suffix &&
        <span>
          { " " }
          { suffix }
        </span>
      }
    </div>
  );
}

export default Balance;
