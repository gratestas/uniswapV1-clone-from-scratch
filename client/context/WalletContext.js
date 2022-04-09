import { useState, useEffect, createContext } from 'react'

export const WalletContext = createContext()

const RINKEBY_CHAIN_ID = '0x4'

export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()
  const [isChainIdCorrect, setIsChainIdCorrect] = useState(true)

  useEffect(async () => {
    isMetamaskInstalled()
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    if (chainId !== RINKEBY_CHAIN_ID) connectCorrectNetwork()

    window.ethereum.on('accountsChanged', handleAccountChanged)
    window.ethereum.on('chainChanged', (chainId) => handleChainChanged(chainId))
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const isMetamaskInstalled = () => {
    if (!window.ethereum)
      return alert('Please install metamask browser extention!')
  }

  const getAccount = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    return accounts[0]
  }

  const checkCorrectNetworkId = async (chainId) => {
    chainId === RINKEBY_CHAIN_ID
      ? setIsChainIdCorrect(true)
      : setIsChainIdCorrect(false)
  }

  const connectCorrectNetwork = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${Number(4).toString(16)}`,
        },
      ],
    })
    setIsChainIdCorrect(true)
  }

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

  const handleAccountChanged = async (newAccount) => {
    const account = newAccount[0]
    setCurrentAccount(account)
  }

  const handleChainChanged = async (chainId) => {
    checkCorrectNetworkId(chainId)
  }

  return (
    <WalletContext.Provider
      value={{
        currentAccount,
        isChainIdCorrect,
        connectWallet,
        connectCorrectNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
