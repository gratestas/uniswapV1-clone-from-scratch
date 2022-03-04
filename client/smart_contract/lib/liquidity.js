import tokens from './constants/tokens'
import { getFactoryContract, getExchange } from '../lib/contractFunctions'
import { getSigner, fromWei } from '../lib/utils'
// -pools
//  --token address --> fetch exchange and then get its liquidity
//  --token symbol
//  --token icon
//  -- pool liquidity

// also set timer to fetch the current state of liquidity on the exchange
// let it be every 1 min

export const getAllPoolsData = async () => {
  const allPoolsData = []
  const signer = getSigner()
  const factory = getFactoryContract(signer)
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    if (token.address && (await factory.doesExchangeExist(token.address))) {
      let liquidity = await fetchPoolLiquidity(token.address, signer)
      let data = { token, liquidity }
      allPoolsData.push(data)
    }
  }
  return allPoolsData
}

export const getLPTokensAndPoolShare = async (tokenAddress, account) => {
  const signer = getSigner()
  const exchange = await getExchange(tokenAddress, signer)

  const LP_tokens = fromWei(await exchange.balanceOf(account))
  const totalSupply = fromWei(await exchange.totalSupply())
  const poolShare = (LP_tokens * 100) / totalSupply

  return [LP_tokens, poolShare]
}

const fetchPoolLiquidity = async (tokenAddress, signer) => {
  const exchange = await getExchange(tokenAddress, signer)
  return fromWei(await exchange.totalSupply())
}
