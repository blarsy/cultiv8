import Web3 from 'web3'
import { abi } from './RealCVAbi.json'

const blockchainProxy = new Web3('http://localhost:8545')
const contractProxy = new blockchainProxy.eth
  .Contract(abi, '0x13a38ccf777269cbc2247c4b8a1ba190d508aec5', {
  from: '0x6e4ab370a87984509aa4122216517ccf72e9ae0c'
})

export default contractProxy
