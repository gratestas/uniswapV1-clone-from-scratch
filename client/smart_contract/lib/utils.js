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

export const parseUnits = (value, decimals) =>
  utils.parseUnits(
    typeof value === 'string' ? value : value.toString(),
    decimals
  )
export const formatUnits = (value, decimals) =>
  utils.formatUnits(value, decimals)

export const getBalance = async (address) => {
  const provider = getProvider(eth)
  return await provider.getBalance(address)
}

export const formatPrecision = (value, decimal = 7) => {
  return value % 1
    ? Number.parseFloat(value).toFixed(decimal)
    : Number.parseFloat(value).toFixed(0)
}
