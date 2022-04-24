module.exports = {
  networks: {
    42: {
      addressUrl: 'https://dashboard.tenderly.co/contract/kovan/',
      txUrl: 'https://dashboard.tenderly.co/tx/kovan/',
      // addressUrl: 'https://kovan.etherscan.io/address/',
      // txUrl: 'https://kovan.etherscan.io/tx/',
      metacoin: '0x6f73F80a4F4944f646184dc56799D7B87059E016',
      relayHub: '0x727862794bdaa3b8Bc4E3705950D4e9397E3bAfd',
      paymaster: '0xFACb65Ea83795c54Fb92Bb3B646B757A9eB9ECA2',
      forwarder: '0x7eEae829DF28F9Ce522274D5771A6Be91d00E5ED'
    },
    3: {
      addressUrl: 'https://dashboard.tenderly.co/contract/ropsten/',
      txUrl: 'https://dashboard.tenderly.co/tx/ropsten/',
      // addressUrl: 'https://ropsten.etherscan.io/address/',
      // txUrl: 'https://ropsten.etherscan.io/tx/',
      metacoin: '0x49139BdC9d484068851d2862ef8233c4D31e679b',
      relayHub: '0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA',
      paymaster: '0x246aC46ad7ee41A1Ba87DbF9Dd0592E8a20951D9',
      forwarder: '0xeB230bF62267E94e657b5cbE74bdcea78EB3a5AB'
    },
    4: {
      addressUrl: 'https://dashboard.tenderly.co/contract/rinkeby/',
      txUrl: 'https://dashboard.tenderly.co/tx/rinkeby/',
      // addressUrl: 'https://rinkeby.etherscan.io/address/',
      // txUrl: 'https://rinkeby.etherscan.io/tx/',
      metacoin: '0x150FfA38f62ead5c269B778bC16E155162cDC305',
      relayHub: '0x6650d69225CA31049DB7Bd210aE4671c0B1ca132',
      paymaster: '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016',
      forwarder: '0x83A54884bE4657706785D7309cf46B58FE5f6e8a'
    }
  }
}
