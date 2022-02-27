import { ethers } from 'ethers'
import contract from '../data/Factory.json'
import exchangeData from '../data/Exchange.json'
import ERC20 from '../data/Token.json'

export const getFactoryContract = (signer) => {
  return new ethers.Contract(contract.address, contract.abi, signer)
}

export const getTokenContract = (tokenAddress, signer) => {
  return new ethers.Contract(tokenAddress, ERC20.abi, signer)
}

export const createExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)
  const exchangeAddress = await factory.callStatic.createExchange(tokenAddress)
  console.log(
    'contractFunctions/createExchange: exchangeAddress: ',
    exchangeAddress
  )
  return new ethers.Contract(exchangeAddress, exchangeData.abi, signer)
}

export const getExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)

  const exchangeAddress = await factory.callStatic.getExchange(tokenAddress)
  console.log('contractFunctions/getExchange: exchangeAddress', exchangeAddress)
  return new ethers.Contract(exchangeAddress, exchangeData.abi, signer)
}

export const getAmountOut = async (
  amountIn,
  tokenAddressOut,
  tokenAddressIn,
  signer
) => {
  const tokenOut = getTokenContract(tokenAddressOut, signer)

  const tokenSymbolOut = await tokenOut.symbol()
  let tokenReserveIn, tokenReserveOut, exchange, amountOut

  //if user buys eth ->out
  if (tokenSymbolOut === 'ETH') {
    const tokenIn = getTokenContract(tokenAddressIn, signer)

    exchange = await getExchange(tokenAddressIn, signer)

    tokenReserveIn = await tokenIn.balanceOf(tokenAddressIn)
    tokenReserveOut = await ethers.signer.getBalance(exchange.address)
    amountOut = await exchange.ethAmountPurchased(amountIn)
    return amountOut.toString()
  } else {
    //if user buys token ->out in exchange of ETH ->in

    //exchange = await getExchange(tokenAddressOut, signer)
    //console.log('contractFunction/getAmount(): exchange of token out', exchange)
    //
    //amountOut = await exchange.tokenAmountPurchased(amountIn)
    //console.log(
    //  'contractFunction/getAmount(): tokenAmountPurchased',
    //  amountOut.toString()
    //)
    const amountOut = 2 * amountIn
    return amountOut

    //console.log(
    //  'contractFunction/getAmount(): tokenAmountPurchased',
    //  tokenAmountOut.toString()
    //)
    ////reserve of token
    //tokenReserveOut = await exchange.getReserve()
    //console.log(
    //  'contractFunction/getAmount(): reserve of token out',
    //  tokenReserveOut.toString()
    //)
    ////reserve of ETH
    //tokenReserveIn = await exchange.getReserve()
    //console.log(
    //  'contractFunction/getAmount(): reserve of token in',
    //  tokenReserveIn.toString()
    //)
  }
  //return await exchange.getAmount(amountIn, tokenReserveIn, tokenReserveOut)
}

export const swapTokens = async (amountIn, tokenPair, signer) => {
  let exchange
  const tokenInAddress = tokenPair.in.address
  const tokenOutAddress = tokenPair.out.address

  if (tokenPair.in.symbol === 'ETH') {
    exchange = await getExchange(tokenOutAddress, signer)
    try {
      //TODO:amountIn must be eth amount coming from input field
      const minTokenOut = exchange.tokenAmountPurchased(amountIn)
      await exchange.ethToTokenSwap(minTokenOut)
    } catch (error) {
      console.log(error)
    }
  } else if (tokenPair.out.address === 'ETH') {
    exchange = await getExchange(tokenInAddress, signer)
    try {
      //TODO:amountIn must be token amount coming from input field
      const minTokenOut = await exchange.ethAmountPurchased(amountIn)
      await exchange.tokenToEthSwap(tokenIn, minTokenOut)
    } catch (error) {
      console.log(error)
    }
  } else {
    //tokenToTokenSwap
  }
}

const isString = (value) => {
  return typeof value === 'string' || value instanceof String
}
