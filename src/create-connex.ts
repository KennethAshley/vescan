import { DriverNoVendor } from '@vechain/connex.driver-nodejs/dist/driver-no-vendor'
import { SimpleNet } from '@vechain/connex.driver-nodejs/dist/simple-net'
import { Framework } from '@vechain/connex-framework'

function genesisIdToNetwork(id: string) {
  switch (id) {
    case '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a': return 'main'
    case '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127': return 'test'
    case '0x00000000973ceb7f343a58b08f0693d6701a5fd354ff73d7058af3fba222aea4': return 'solo'
    default: return 'custom'
  }
}

const mainNetGenesis = {
  number: 0,
  id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
  size: 170,
  parentID: '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
  timestamp: 1530316800,
  gasLimit: 10000000,
  beneficiary: '0x0000000000000000000000000000000000000000',
  gasUsed: 0,
  totalScore: 0,
  txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
  stateRoot: '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
  receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
  signer: '0x0000000000000000000000000000000000000000',
  transactions: [],
  isTrunk: true,
};

const testNetGenesis = {
  number: 0,
  id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
  size: 170,
  parentID: '0xffffffff00000000000000000000000000000000000000000000000000000000',
  timestamp: 1530014400,
  gasLimit: 10000000,
  beneficiary: '0x0000000000000000000000000000000000000000',
  gasUsed: 0,
  totalScore: 0,
  txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
  stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
  receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
  signer: '0x0000000000000000000000000000000000000000',
  transactions: [],
  isTrunk: true,
};

class SimpleDriver extends DriverNoVendor {
  constructor(net: 'main' | 'test') {
    let url = 'http://localhost:8669';

    if (process.env.NODE_ENV === 'production') {
      url = net === 'main' ? 'https://sync-mainnet.vechain.org' : 'https://sync-testnet.vechain.org'
    }

    super(new SimpleNet(url), net === 'main' ? mainNetGenesis : testNetGenesis)
  }

  public signTx(): any {
    throw new Error('Method not implemented.')
  }

  public signCert(): any {
    throw new Error('Method not implemented.')
  }

  public isAddressOwned(addr: string) {
    return Promise.resolve(false)
  }
}

export function createConnex(net?: 'main' | 'test'): { connex: Connex, shuffle: boolean } {
  if (net) {
    if (window.connex && genesisIdToNetwork(window.connex.thor.genesis.id) === net) {
      return { connex: window.connex, shuffle: false }
    }
    return { connex: new Framework(new SimpleDriver(net)), shuffle: true }
  } else {
    if (window.connex) {
      return { connex: window.connex, shuffle: false }
    } else {
      return { connex: new Framework(new SimpleDriver('main')), shuffle: true }
    }
  }
}
