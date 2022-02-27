import { useState, useEffect, createContext } from 'react'
import {
  toWei,
  fromWei,
  getSigner,
  getBalance,
} from '../smart_contract/lib/utils'
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
    const token = getTokenContract(
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      signer
    )
    console.log({ token })
    const exchangeUSDT = await getExchange(token.address, signer)
    console.log({ exchangeUSDT })
    await token.approve(exchangeUSDT.address, toWei(20000))
    await exchangeUSDT.addLiquidity(toWei(20000), { value: toWei(5) })
    console.log(`
    liquidiy has been added
    =======================
    ETH balance of exchange: ${fromWei(await getBalance(exchangeUSDT.address))}
    `)
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
