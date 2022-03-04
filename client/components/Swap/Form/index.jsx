import { useState, useContext } from 'react'
import { HiOutlineSwitchVertical } from 'react-icons/hi'
import { TransactionContext } from '../../../context/TransactionContext'
import {
  getAmountOut,
  swapTokens,
} from '../../../smart_contract/lib/contractFunctions'
import { fromWei, getSigner, toWei } from '../../../smart_contract/lib/utils'
import CurrencySelectButton from '../../CurrencySelectButton'

const styles = {
  inputContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  input: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  switchContainer: `flex justify-center cursor-pointer`,
  switchIcon: `w-8 h-8 rounded-lg border border-[#20242A] hover:border-[#41444F] flex justify-center items-center`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

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
    console.log(input.value)
    const signer = getSigner(eth)
    const amountOut = await getAmountOut(
      toWei(Number(input.value)),
      tokenPair.in.address,
      tokenPair.out.address,
      signer
    )
    console.log('amountOut', fromWei(amountOut).toString())

    setOutput(fromWei(amountOut))
  }

  const handleSubmit = async () => {
    const signer = getSigner(eth)
    console.log('handleSubmit: amount in:', input.value)
    await swapTokens(toWei(Number(input.value)), tokenPair, signer)
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
          //onChange={(e) => handleChange(e, 'amount')}
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
          //onChange={(e) => handleChange(e, 'amount')}
          //onChange={(e) => handleChange(e)}
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
