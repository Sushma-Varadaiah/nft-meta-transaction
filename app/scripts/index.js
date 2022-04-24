import '../styles/app.css'
import Web3 from 'web3'
import contract from 'truffle-contract'

import metaTransactionNFTArtifact from '../../build/contracts/MetaTransactionNFT.json'
import IPaymaster from '../../build/contracts/IPaymaster.json'
import { networks } from './networks'

const Gsn = require('@opengsn/provider')

const RelayProvider = Gsn.RelayProvider

const MetaTransactionNFT = contract(metaTransactionNFTArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts, account

var network

const App = {
  start: async function () {
    const self = this
    // This should actually be web3.eth.getChainId but MM compares networkId to chainId apparently
    web3.eth.net.getId(async function (err, networkId) {
      if (parseInt(networkId) < 1000) { // We're on testnet/
        network = networks[networkId]
        //MetaTransactionNFT.deployed = () => MetaTransactionNFT.at(network.metacoin)
      } else { // We're on ganache
        console.log('Using local ganache')
        network = {
          relayHub: require('../../build/gsn/RelayHub.json').address,
          paymaster: require('../../build/gsn/Paymaster.json').address,
          forwarder: require('../../build/gsn/Forwarder.json').address
        }
      }
      if (!network) {
        const fatalmessage = document.getElementById('fatalmessage')
        fatalmessage.innerHTML = "Wrong network. please switch to 'kovan' or 'ropsten' or 'rinkeby'"
        return
      }
      console.log('chainid=', networkId, network)

      if (err) {
        console.log('Error getting chainId', err)
        process.exit(-1)
      }
      const gsnConfig = {
        relayLookupWindowBlocks: 600000,
        loggerConfigration: {
          logLevel: window.location.href.includes('verbose') ? 'debug' : 'error'
        },
        paymasterAddress: network.paymaster
      }
      var provider = RelayProvider.newProvider({ provider: web3.currentProvider, config: gsnConfig })
      await provider.init()
      web3.setProvider(provider)

      MetaTransactionNFT.setProvider(web3.currentProvider)

      // Get the initial account balance so it can be displayed.
      web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
          alert('There was an error fetching your accounts.')
          return
        }

        if (accs.length === 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
          return
        }

        accounts = accs
        account = accounts[0]

        self.refreshBalance()
      })
    })
  },

  link: function (path, text) {
    return '<a href="' + network.baseurl + path + '">' + text + '</a>'
  },

  addressLink: function (addr) {
    return '<a href="' + network.addressUrl + addr + '" target="_info">' + addr + '</a>'
  },

  txLink: function (addr) {
    return '<a href="' + network.txUrl + addr + '" target="_info">' + addr + '</a>'
  },

  refreshBalance: function () {
    const self = this

    function putItem(name, val) {
      const item = document.getElementById(name)
      item.innerHTML = val
    }
    function putAddr(name, addr) {
      putItem(name, self.addressLink(addr))
    }

    putAddr('paymaster', network.paymaster)

    new web3.eth.Contract(IPaymaster.abi, network.paymaster).methods
      .getHubAddr().call().then(hub => {
        putAddr('hubaddr', hub)
      }).catch(console.log)

    new web3.eth.Contract(IPaymaster.abi, network.paymaster).methods
      .getRelayHubDeposit().call().then(bal => {
        putItem('paymasterBal', 'eth balance: ' + (bal / 1e18))
      }).catch(console.log)

    new web3.eth.Contract(IPaymaster.abi, network.paymaster).methods
      .trustedForwarder().call().then(forwarder => {
        putAddr('forwarderAddress', forwarder)
      }).catch(console.log)

    let meta
    MetaTransactionNFT.deployed().then(function (instance) {
      meta = instance
      putAddr('address', account)
      putAddr('metaaddr', MetaTransactionNFT.address)

      return meta.balanceOf.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()

    }).catch(function (e) {
      const fatalmessage = document.getElementById('fatalmessage')
      console.log(e)
      if (/mismatch/.test(e)) {
        fatalmessage.innerHTML = "Wrong network. please switch to 'kovan', 'rinekby', or 'ropsten' "
      }
    })
  },

  mint: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    let meta
    MetaTransactionNFT.deployed().then(function (instance) {
      meta = instance
      return meta.mint(amount, receiver,
        { from: account })
    }).then(function (res) {
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
    })
  }
}

window.App = App
window.addEventListener('load', async () => {
  if (window.ethereum) {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' (and allowed the app to access MetaMask.)' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    window.web3 = new Web3(ethereum)
    try {
      // Request account access if needed
      await ethereum.enable()

      ethereum.on('chainChanged', (chainId) => {
        console.log('chainChanged', chainId)
        window.location.reload()
      })
      ethereum.on('accountsChanged', (accs) => {
        console.log('accountChanged', accs)
        window.location.reload()
      })

    } catch (error) {
      // User denied account access...
      alert('NO NO NO')
    }
  } else if (window.web3) {
    // Legacy dapp browsers...
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }
  await App.start()
})
