import { useState, useEffect, createContext } from 'react'
import { getAccount } from '../smart_contract/lib/utils'

export const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()

  useEffect(() => {
    isMetamaskInstalled()
    checkIfAccountConnected()
    window.ethereum.on('accountsChanged', handleAccountChanged)
  }, [])

  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!')

      try {
        const account = await getAccount()
        await handleAccountChanged(account)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('Need to install MetaMask')
    }
  }

  const getAccount = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return accounts[0]
  }

  const isMetamaskInstalled = () => {
    if (!window.ethereum)
      return alert('Please install metamask browser extention!')
  }

  const checkIfAccountConnected = async () => {
    const account = await getAccount()
    if (!account) return
    setCurrentAccount(account)
  }

  const handleAccountChanged = async (newAccount) => {
    setCurrentAccount(newAccount)
    console.log('account changed to:', currentAccount)
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

  return (
    <WalletContext.Provider
      value={{
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
