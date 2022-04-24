const MetaTxnNFT = artifacts.require('MetaTransactionNFT')
const Forwarder = artifacts.require('Forwarder.sol')

module.exports = async function (deployer, network) {
  // first, check if already deployed through truffle:
  const forwarder = await Forwarder.deployed().then(c => c.address).catch(e => require('../build/gsn/Forwarder.json').address)
  if (!forwarder) {
    throw new Error('no valid forwarder for network ' + network)
  }
  console.log('using forwarder: ', forwarder)
  await deployer.deploy(MetaTxnNFT)
  console.log('Finished migration')
}
