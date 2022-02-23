import { useState, useEffect, createContext } from 'react'
import { toWei, getSigner } from '../smart_contract/lib/utils'
import {
  getFactoryContract,
  createExchange,
  getExchange,
  getTokenContract,
} from '../smart_contract/lib/contractFunctions.js'

export const TransactionContext = createContext()

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

export const TransactionProvider = ({ children }) => {
  let factory
  const [tokenPair, setTokenPair] = useState({
    in: '',
    out: '',
  })
  const [tradeSide, setTradeSide] = useState('')
  const [isCurrencyListOpen, setIsCurrencyListOpen] = useState(false)

  const loadBlockchainData = async (metamask = eth) => {
    const signer = getSigner(metamask)
    factory = getFactoryContract(signer)
    const token = getTokenContract(
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      signer
    )
    console.log({ token })
    const exchangeUSDT = await createExchange(
      '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      signer
    )
    console.log({ exchangeUSDT })
    await token.approve(exchangeUSDT.address, toWei(20000))
    await exchangeUSDT.addLiquidity(toWei(20000), { value: toWei(5) })
    //
    //const token = getTokenContract(metamask)
    //console.log({ token })
  }

  const closePanel = () => {
    setIsCurrencyListOpen(false)
  }

  return (
    <TransactionContext.Provider
      value={{
        factory,
        isCurrencyListOpen,
        setIsCurrencyListOpen,
        tokenPair,
        setTokenPair,
        tradeSide,
        setTradeSide,
        closePanel,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
