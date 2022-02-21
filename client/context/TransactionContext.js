import { useState, useEffect, createContext } from 'react'
import {
  getFactoryContract,
  createExchange,
  getTokenContract,
} from '../smart_contract/lib/utils'
export const TransactionContext = createContext()

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const isMetamaskInstalled = (metamask = eth) => {
  if (!metamask) return alert('Please install metamask extention!')
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()
  //const [selectedTokenIn, setSelectedTokenIn] = useState()
  //const [selectedTokenOut, setSelectedTokenOut] = useState()
  const [tokenPair, setTokenPair] = useState({
    in: '',
    out: '',
  })
  const [tradeSide, setTradeSide] = useState('')
  const [isCurrencyListOpen, setIsCurrencyListOpen] = useState(false)
  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  const connectWallet = async (metamask = eth) => {
    try {
      isMetamaskInstalled(metamask)
      const [connectedAccount] = await metamask.request({
        method: 'eth_requestAccounts',
      })
      setCurrentAccount(connectedAccount)
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object')
    }
  }

  const checkIfWalletConnected = async (metamask = eth) => {
    try {
      isMetamaskInstalled(metamask)
      const accounts = await metamask.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setCurrentAccount(accounts[0])
      }
      const contract = getFactoryContract(metamask)
      console.log({ contract })
      //const exchange = await createExchange(metamask)
      //console.log({ exchange })
      //
      //const token = getTokenContract(metamask)
      //console.log({ token })
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object')
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0x4'

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  const closePanel = () => {
    setIsCurrencyListOpen(false)
  }
  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
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
