import { useState, useContext, useEffect } from 'react'
import { HiOutlineSwitchVertical } from 'react-icons/hi'
import { TransactionContext } from '../../../context/TransactionContext'
import { WalletContext } from '../../../context/WalletContext'
import {
  getAmountOut,
  swapTokens,
  getTokenBalance,
} from '../../../smart_contract/lib/contractFunctions'
import {
  fromWei,
  getSigner,
  toWei,
  formatPrecision,
  getEthBalance,
} from '../../../smart_contract/lib/utils'
import CurrencySelectButton from '../../CurrencySelectButton'

import { styles } from './styles'
let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const SwapForm = () => {
  const { tokenPair, setTokenPair } = useContext(TransactionContext)
  const { currentAccount } = useContext(WalletContext)
  const [input, setInput] = useState({ value: 0 })
  const [output, setOutput] = useState('0.0')
  const [tokenInBalance, setTokenInBalance] = useState(0)
  const [tokenOutBalance, setTokenOutBalance] = useState(0)

  const switchPair = () => {
    setTokenPair({
      in: tokenPair.out,
      out: tokenPair.in,
    })
  }
  const handleChange = async (e) => {
    if (!Number(input.value)) return
    console.log(input.value)
    const signer = getSigner(eth)
    console.log('handleChange', input.value)
    console.log('handleChange toWei', toWei(input.value).toString())
    const amountOut = await getAmountOut(
      toWei(input.value),
      tokenPair.in.address,
      tokenPair.out.address,
      signer
    )
    setOutput(formatPrecision(amountOut, 4))
  }

  const handleSwap = async () => {
    const signer = getSigner(eth)
    console.log('handleSubmit: amount in:', input.value)
    await swapTokens(toWei(input.value), tokenPair, signer)

    console.log('transaction sucessfully completed')
    setInput({ value: 0 })
    setOutput('0.0')
  }

  const getBalance = async (token, accountAddress) => {
    const signer = getSigner(eth)
    let balance
    if (token.symbol === 'ETH') {
      balance = await getEthBalance(accountAddress)
    } else {
      balance = await getTokenBalance(token.address, accountAddress, signer)
    }
    return formatPrecision(fromWei(balance), 2)
  }

  useEffect(async () => {
    if (!tokenPair.in) return
    const balance = await getBalance(tokenPair.in, currentAccount)
    setTokenInBalance(balance)
  }, [currentAccount, tokenPair.in])

  useEffect(async () => {
    if (!tokenPair.out) return
    const balance = await getBalance(tokenPair.out, currentAccount)
    setTokenOutBalance(balance)
  }, [currentAccount, tokenPair.out])

  return (
    <div className="relative">
      <div className={styles.inputContainer}>
        <div className={styles.balance}>Balance: {tokenInBalance}</div>
        <div className={styles.inputContainer_inner}>
          <input
            type="number"
            ref={(input) => {
              setInput(input)
            }}
            className={styles.input}
            placeholder="0.0"
            pattern="^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"
            onChange={(e) => handleChange(e)}
          />
          <CurrencySelectButton selectedToken={tokenPair.in} tradeSide="in" />
        </div>
      </div>

      <div className={styles.switchContainer}>
        <div className={styles.switchIcon} onClick={() => switchPair()}>
          <HiOutlineSwitchVertical />
        </div>
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.balance}>Balance: {tokenOutBalance}</div>
        <div className={styles.inputContainer_inner}>
          <input
            type="number"
            className={styles.input}
            value={output}
            placeholder="0.0"
            disabled
            pattern="^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"
          />
          <CurrencySelectButton selectedToken={tokenPair.out} tradeSide="out" />
        </div>
      </div>
      <div className={styles.confirmButton} onClick={handleSwap}>
        Confirm
      </div>
    </div>
  )
}
export default SwapForm
