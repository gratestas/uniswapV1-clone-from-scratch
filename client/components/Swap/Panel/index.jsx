import { useState, useContext, useEffect } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'
import { HiOutlineSwitchVertical } from 'react-icons/hi'

import CurrencyListModal from '../../CurrencyListModal/index.jsx'
import InputField from '../InputField/index.jsx'
import { styles } from './styles'

import { TransactionContext } from '../../../context/TransactionContext'
import { getAmountOut } from '../../../smart_contract/lib/contractFunctions'
import { getSigner } from '../../../smart_contract/lib/utils'

const TRADE_SIDE = { in: 'in', out: 'out' }

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const SwapPanel = () => {
  const { factory, tokenPair, setTokenPair, tradeSide } =
    useContext(TransactionContext)
  const [fieldValueIn, setFieldValueIn] = useState()
  const [fieldValueOut, setFieldValueOut] = useState()
  console.log({ fieldValueIn })
  console.log({ fieldValueOut })
  console.log({ tokenPair })
  console.log({ factory })

  const switchPair = () => {
    setTokenPair({
      in: tokenPair.out,
      out: tokenPair.in,
    })
    //TODO: inputField values do update but do not render.Need to fix this later :conrolled vs uncontrolled
    // checko out Dapp university tutorial
    //if (fieldValueIn !== undefined) setFieldValueOut(fieldValueIn)
    //if (fieldValueOut !== undefined) setFieldValueIn(fieldValueOut)
  }

  const swap = async () => {
    await SwapToken('tokenAddress1', 'tokenAddress2', 'fieldValue')
  }

  const calculateAmountOut = async (metamask = eth) => {
    if (tradeSide === TRADE_SIDE.in && fieldValueIn !== undefined) {
      //const signer = getSigner(metamask)
      //console.log('swap panel: signer', signer)
      //const amountOut = await getAmountOut(
      //  fieldValueIn,
      //  tokenPair.out.address,
      //  tokenPair.in.address,
      //  signer
      //)
      const amount = fieldValueIn * 2
      setFieldValueOut(amount)
    }
    if (tradeSide === TRADE_SIDE.out && fieldValueOut !== undefined) {
      const amount = fieldValueOut / 2
      setFieldValueIn(amount)
    }
  }

  useEffect(() => {
    calculateAmountOut()
  }, [fieldValueIn, tokenPair])

  useEffect(() => {
    calculateAmountOut()
  }, [fieldValueOut, tokenPair])

  const handleSubmit = (e) => {}
  return (
    <div className={styles.swapForm}>
      <CurrencyListModal />
      <div className={styles.formHeader}>
        <div>Swap</div>
        <div>
          <RiSettings3Fill />
        </div>
      </div>
      <InputField
        selectedToken={tokenPair.in}
        tradeSide={TRADE_SIDE.in}
        fieldValue={fieldValueIn}
        setFieldValue={setFieldValueIn}
      />
      <div className={styles.switchContainer} onClick={() => switchPair()}>
        <div className={styles.switchIcon}>
          <HiOutlineSwitchVertical />
        </div>
      </div>
      <InputField
        selectedToken={tokenPair.out}
        tradeSide={TRADE_SIDE.out}
        fieldValue={fieldValueOut}
        setFieldValue={setFieldValueOut}
      />
      <div className={styles.confirmButton} onClick={(e) => handleSubmit(e)}>
        Confirm
      </div>
    </div>
  )
}

export default SwapPanel
