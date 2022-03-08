import { useState, useContext } from 'react'
import { HiOutlineSwitchVertical } from 'react-icons/hi'
import { TransactionContext } from '../../../context/TransactionContext'
import {
  getAmountOut,
  swapTokens,
} from '../../../smart_contract/lib/contractFunctions'
import {
  fromWei,
  getSigner,
  toWei,
  formatPrecision,
} from '../../../smart_contract/lib/utils'
import CurrencySelectButton from '../../CurrencySelectButton'

import { styles } from './styles'
let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const SwapForm = () => {
  const { tokenPair, setTokenPair } = useContext(TransactionContext)
  const [input, setInput] = useState({ value: 0 })
  const [output, setOutput] = useState('0.0')
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

  const handleSubmit = async () => {
    const signer = getSigner(eth)
    console.log('handleSubmit: amount in:', input.value)
    await swapTokens(toWei(input.value), tokenPair, signer)
    console.log('transaction sucessfully completed')
    setInput({ value: 0 })
    setOutput('0.0')
  }
  return (
    <div>
      <div className={styles.inputContainer}>
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
      <div className={styles.switchContainer} onClick={() => switchPair()}>
        <div className={styles.switchIcon}>
          <HiOutlineSwitchVertical />
        </div>
      </div>
      <div className={styles.inputContainer}>
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
      <div className={styles.confirmButton} onClick={handleSubmit}>
        Confirm
      </div>
    </div>
  )
}
export default SwapForm
