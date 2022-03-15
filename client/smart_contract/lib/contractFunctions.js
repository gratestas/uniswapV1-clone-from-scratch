import { Contract } from 'ethers'
import contract from '../data/Factory.json'
import exchangeData from '../data/Exchange.json'
import ERC20 from '../data/Token.json'
import tokens from './constants/tokens'
import { formatUnits, parseUnits, fromWei, toWei } from './utils'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getFactoryContract = (signer) => {
  return new Contract(contract.address, contract.abi, signer)
}

export const getTokenContract = (tokenAddress, signer) => {
  return new Contract(tokenAddress, ERC20.abi, signer)
}

export const getTokenBalance = async (tokenAddress, accountAddress, signer) => {
  const token = getTokenContract(tokenAddress, signer)
  return await token.balanceOf(accountAddress)
}

export const getTokenDecimal = async (tokenAddress, signer) => {
  if (!tokenAddress) return 18
  const token = getTokenContract(tokenAddress, signer)
  return await token.decimals()
}

export const createExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)
  console.log('contractFunctions/createExchange: creating a new exchange')

  const doesExchangeExist = await factory.doesExchangeExist(tokenAddress)
  console.log({ doesExchangeExist })

  if (await factory.doesExchangeExist(tokenAddress)) return
  await factory.createExchange(tokenAddress)
}

export const getExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)

  const exchangeAddress = await factory.getExchange(tokenAddress)
  console.log('contractFunctions/getExchange: exchangeAddress', exchangeAddress)

  return new Contract(exchangeAddress, exchangeData.abi, signer)
}

export const fetchExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)

  const exchangeAddress = await factory.callStatic.getExchange(tokenAddress)
  console.log('contractFunctions/getExchange: exchangeAddress', exchangeAddress)

  if (exchangeAddress.toString() === NULL_ADDRESS) {
    console.log(
      'exchange does not exist. Attempting to create a new exchange..'
    )
    const newExchange = createExchange(tokenAddress, signer)
    return newExchange
  }
  return new Contract(exchangeAddress, exchangeData.abi, signer)
}

export const getAmountOut = async (
  amountIn,
  tokenAddressIn,
  tokenAddressOut,
  signer
) => {
  let token, tokenSymbolIn, tokenSymbolOut, exchangeIn, exchangeOut, amountOut
  const slippage = 0.99
  if (tokenAddressIn === '') {
    token = getTokenContract(tokenAddressOut, signer)
    tokenSymbolOut = await token.symbol()
    tokenSymbolIn = 'ETH'
  }

  if (tokenAddressOut === '') {
    tokenSymbolOut = 'ETH'
    token = getTokenContract(tokenAddressIn, signer)
    tokenSymbolIn = await token.symbol()
  }

  console.log({ tokenSymbolOut })
  console.log({ amountIn })

  //if user buys eth ->out
  if (tokenSymbolOut === 'ETH') {
    exchangeIn = await getExchange(tokenAddressIn, signer)
    console.log({ tokenAddressIn })
    amountOut = await exchangeIn.ethAmountPurchased(amountIn)
    console.log('contractFunctions: amountOut', fromWei(amountOut))

    return fromWei(amountOut) * slippage
  } else if (tokenSymbolIn === 'ETH') {
    //if user buys token ->out in exchange of ETH ->in
    exchangeOut = await getExchange(tokenAddressOut, signer)
    amountOut = await exchangeOut.tokenAmountPurchased(amountIn)
    console.log('contractFunction: amountOut', fromWei(amountOut.toString()))
    return fromWei(amountOut) * slippage
  } else {
    console.log('swapping token-2-token ...')
    token = getTokenContract(tokenAddressIn, signer)
    const decimals = await token.decimals()
    exchangeIn = await getExchange(tokenAddressIn, signer)
    const ethAmountOut = await exchangeIn.ethAmountPurchased(amountIn)
    const ethAmountIn_min = ethAmountOut
    console.log('ethAmountIn_min', ethAmountIn_min.toString())

    exchangeOut = await getExchange(tokenAddressOut, signer)
    amountOut = await exchangeOut.tokenAmountPurchased(ethAmountIn_min)
    return formatUnits(amountOut, decimals) * slippage
  }
}

export const swapTokens = async (amountIn, tokenPair, signer) => {
  console.log('in swapTokens')
  let token, exchange, minTokenOut
  let txResponse, txReceipt

  const tokenAddressIn = tokenPair.in.address
  const tokenAddressOut = tokenPair.out.address

  if (tokenPair.in.symbol === 'ETH') {
    exchange = await getExchange(tokenAddressOut, signer)

    try {
      console.log(`Swapping ${amountIn} ETH for tokens...`)
      minTokenOut = await exchange.tokenAmountPurchased(amountIn)
      console.log(
        'contractFunctions/swapTokens: minTokensOut',
        minTokenOut.toString()
      )
      txResponse = await exchange.ethToTokenSwap(minTokenOut, {
        value: amountIn,
      })
      txReceipt = await txResponse.wait()
      const txEvent = txReceipt.events.filter(
        (el) => el.event === 'SwapTransfer'
      )
      const txHash = txEvent[0].transactionHash
      const txData = txEvent[0].args
      console.log({ txEvent })
      return { txHash, txData }
    } catch (error) {
      console.log(error)
      const txHash = ''
      const txData = ''
      return { txHash, txData }
    }
  } else if (tokenPair.out.symbol === 'ETH') {
    try {
      token = getTokenContract(tokenAddressIn, signer)
      exchange = await getExchange(tokenAddressIn, signer)
      console.log(
        `Swapping ${amountIn} ${tokenPair.in.symbol} for ${tokenPair.out.symbol}...`
      )
      minTokenOut = await exchange.ethAmountPurchased(amountIn)

      await token.approve(exchange.address, amountIn)
      txResponse = await exchange.tokenToEthSwap(amountIn, minTokenOut)
      txReceipt = await txResponse.wait()
      const txEvent = txReceipt.events.filter(
        (el) => el.event === 'SwapTransfer'
      )
      const txHash = txEvent[0].transactionHash
      const txData = txEvent[0].args

      return { txHash, txData }
    } catch (error) {
      console.log(error)
      const txHash = ''
      const txData = ''
      return { txHash, txData }
    }
  } else {
    const token = getTokenContract(tokenAddressIn, signer)
    try {
      const decimals = await token.decimals()
      exchange = await getExchange(tokenPair.in.address, signer)

      await token.approve(exchange.address, amountIn)
      minTokenOut = await getAmountOut(
        amountIn,
        tokenAddressIn,
        tokenAddressOut,
        signer
      )
      console.log({ minTokenOut })
      txResponse = await exchange.tokenToTokenSwap(
        amountIn,
        parseUnits(minTokenOut, decimals),
        tokenAddressOut
      )
      txReceipt = await txResponse.wait()
      const txEvents = txReceipt.events.filter(
        (el) => el.event === 'SwapTransfer'
      )
      console.log('txEvents', txEvents)

      const filteredEvent = txEvents.filter(
        (event) => event.args.txType === 'Token to Token'
      )
      console.log('event', filteredEvent)
      const txHash = filteredEvent[0].transactionHash
      const txData = filteredEvent[0].args

      return { txHash, txData }
    } catch (error) {
      console.log(error)
      const txHash = ''
      const txData = ''
      return { txHash, txData }
    }
  }
}

export const addLiquidity = async (
  tokenAddress,
  tokenAmount,
  ethAmount,
  signer
) => {
  const token = getTokenContract(tokenAddress, signer)
  const exchange = await getExchange(tokenAddress, signer)

  await token.approve(exchange.address, tokenAmount)
  return await exchange.addLiquidity(tokenAmount, {
    value: ethAmount,
  })
}

export const removeLiquidity = async (tokenAddress, LPtokens, signer) => {
  const exchange = await getExchange(tokenAddress, signer)
  //TODO: remove liquidty returns amounts of eth and token. these values can be used to notify user how much he get back in terms of two tokens
  await exchange.removeLiquidity(LPtokens)
}

const isString = (value) => {
  return typeof value === 'string' || value instanceof String
}
