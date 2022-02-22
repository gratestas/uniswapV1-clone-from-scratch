import { useState, useContext, useEffect } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'
import { HiOutlineSwitchVertical } from 'react-icons/hi'

import CurrencyListModal from '../../CurrencyListModal/index.jsx'
import { TransactionContext } from '../../../context/TransactionContext'
import InputField from '../InputField/index.jsx'
import { styles } from './styles'

const TRADE_SIDE = { in: 'in', out: 'out' }

const SwapPanel = () => {
  const { tokenPair, setTokenPair } = useContext(TransactionContext)
  const [fieldValueIn, setFieldValueIn] = useState()
  const [fieldValueOut, setFieldValueOut] = useState()
  console.log({ fieldValueIn })
  console.log({ fieldValueOut })
  console.log({ tokenPair })

  const switchPair = () => {
    setTokenPair({
      in: tokenPair.out,
      out: tokenPair.in,
    })
    //TODO: inputField values do update but do not render.Need to fix this later
    //if (fieldValueIn !== undefined) setFieldValueOut(fieldValueIn)
    //if (fieldValueOut !== undefined) setFieldValueIn(fieldValueOut)
  }

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
        setFieldValue={setFieldValueOut}
      />
      <div className={styles.confirmButton} onClick={(e) => handleSubmit(e)}>
        Confirm
      </div>
    </div>
  )
}

export default SwapPanel
