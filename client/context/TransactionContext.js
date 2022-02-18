import { useState, useEffect, createContext } from 'react'

export const TransactionContext = createContext()

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()

  const connectWallet = (metamask = eth) => {
    try {
      if (!metamask) return alert('Please install metamask extention!')
      ;[mainAccount] = await metamask.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(mainAccount)
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object')
    }
  }
  return (
    <TransactionContext.Provider value={{ currentAccount, connectWallet }}>
      {children}
    </TransactionContext.Provider>
  )
}

export default TransactionProvider
