import { ethers } from 'ethers'
import contract from '../data/Factory.json'
import exchangeData from '../data/Exchange.json'
import tokenData from '../data/Token.json'

export const getFactoryContract = (ethProvider) => {
  const signer = getSigner(ethProvider)
  const factory = new ethers.Contract(contract.address, contract.abi, signer)

  return factory
}

export const getTokenContract = (ethProvider) => {
  const signer = getSigner(ethProvider)
  const token = new ethers.Contract(tokenData.address, tokenData.abi, signer)

  return token
}

export const createExchange = async (ethProvider) => {
  const factory = getFactoryContract(ethProvider)
  const exchangeAddress = await factory.callStatic.createExchange(
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' // USDT
  )
  const signer = getSigner(ethProvider)

  const exchange = new ethers.Contract(
    exchangeData.address,
    exchangeData.abi,
    signer
  )
  return exchange
}

const getSigner = (ethProvider) => {
  const provider = new ethers.providers.Web3Provider(ethProvider)
  const signer = provider.getSigner()
  return signer
}
