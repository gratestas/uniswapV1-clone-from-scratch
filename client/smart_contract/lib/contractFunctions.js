import { Contract } from 'ethers'
import contract from '../data/Factory.json'
import exchangeData from '../data/Exchange.json'
import ERC20 from '../data/Token.json'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getFactoryContract = (signer) => {
  return new Contract(contract.address, contract.abi, signer)
}

export const getTokenContract = (tokenAddress, signer) => {
  return new Contract(tokenAddress, ERC20.abi, signer)
}

export const createExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)
  console.log('contractFunctions/createExchange: creating a new exchange')

  if (factory.doesExchangeExist(tokenAddress)) return
  await factory.createExchange(tokenAddress)
}

export const getExchange = async (tokenAddress, signer) => {
  const factory = getFactoryContract(signer)

  const exchangeAddress = await factory.callStatic.getExchange(tokenAddress)
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
  let token, tokenSymbolOut, exchange, amountOut

  if (tokenAddressIn === '') {
    token = getTokenContract(tokenAddressOut, signer)
    tokenSymbolOut = await token.symbol()
  } else {
    tokenSymbolOut = 'ETH'
  }
  console.log({ tokenSymbolOut })

  //if user buys eth ->out
  if (tokenSymbolOut === 'ETH') {
    exchange = await getExchange(tokenAddressIn, signer)
    console.log({ tokenAddressIn })
    amountOut = await exchange.callStatic.ethAmountPurchased(amountIn)
    return amountOut
  } else {
    //if user buys token ->out in exchange of ETH ->in

    exchange = await getExchange(tokenAddressOut, signer)

    amountOut = await exchange.callStatic.tokenAmountPurchased(amountIn)
    //const amountOut = 2 * amountIn
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
  const tokenAddressIn = tokenPair.in.address
  const tokenAddressOut = tokenPair.out.address

  if (tokenPair.in.symbol === 'ETH') {
    exchange = await getExchange(tokenAddressOut, signer)
    try {
      console.log(`Swapping ${amountIn} ETH for tokens...`)
      //TODO:amountIn must be eth amount coming from input field
      const minTokenOut = await exchange.tokenAmountPurchased(amountIn)
      console.log(
        'contractFunctions/swapTokens: minTokensOut',
        minTokenOut.toString()
      )
      await exchange.ethToTokenSwap(minTokenOut, { value: amountIn })
    } catch (error) {
      console.log(error)
    }
  } else if (tokenPair.out.symbol === 'ETH') {
    exchange = await getExchange(tokenAddressIn, signer)
    try {
      //TODO:amountIn must be token amount coming from input field
      console.log(
        `Swapping ${amountIn} ${tokenPair.in.symbol} for ${tokenPair.out.symbol}...`
      )
      const token = await getTokenContract(tokenPair.in.address, signer)
      const minTokenOut = await exchange.ethAmountPurchased(amountIn)

      await token.approve(exchange.address, amountIn)
      await exchange.tokenToEthSwap(amountIn, minTokenOut)
    } catch (error) {
      console.log(error)
    }
  } else {
    //tokenToTokenSwap
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

const isString = (value) => {
  return typeof value === 'string' || value instanceof String
}
