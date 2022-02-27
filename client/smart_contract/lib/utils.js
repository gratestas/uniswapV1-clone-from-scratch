import { ethers } from 'ethers'

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const getProvider = (ethProvider = eth) => {
  return new ethers.providers.Web3Provider(ethProvider)
}

export const getSigner = (ethProvider = eth) => {
  const provider = getProvider(ethProvider)

  return provider.getSigner()
}

export const toWei = (value) => ethers.utils.parseEther(value.toString())
export const fromWei = (value) =>
  ethers.utils.formatEther(typeof value === 'string' ? value : value.toString())

export const getBalance = async (address) => {
  const provider = getProvider(eth)
  return await provider.getBalance(address)
}
