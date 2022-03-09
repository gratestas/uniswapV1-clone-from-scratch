import { useState, useEffect, createContext } from 'react'
import { getSigner } from '../smart_contract/lib/utils'
import { getFactoryContract } from '../smart_contract/lib/contractFunctions.js'

import ethLogo from '../assets/eth.png'

export const TransactionContext = createContext()

let eth
if (typeof window !== 'undefined') {
  eth = window.ethereum
}

export const TransactionProvider = ({ children }) => {
  const [factory, setFactory] = useState()
  const [tokenPair, setTokenPair] = useState({
    in: '',
    out: '',
  })
  const [tradeSide, setTradeSide] = useState()
  const [isCurrencyListOpen, setIsCurrencyListOpen] = useState(false)

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async (metamask = eth) => {
    const signer = getSigner(metamask)
    setFactory(getFactoryContract(signer))
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
