import { providers, utils } from 'ethers'

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const getProvider = (ethProvider = eth) => {
  return new providers.Web3Provider(ethProvider)
}

export const getSigner = (ethProvider = eth) => {
  const provider = getProvider(ethProvider)

  return provider.getSigner()
}

export const toWei = (value) => utils.parseEther(value.toString())
export const fromWei = (value) =>
  utils.formatEther(typeof value === 'string' ? value : value.toString())

export const getBalance = async (address) => {
  const provider = getProvider(eth)
  return await provider.getBalance(address)
}

export const formatPrecision = (value, decimal = 7) => {
  const numberValue = Number(value).toPrecision(decimal)
  return numberValue.toString()
}
