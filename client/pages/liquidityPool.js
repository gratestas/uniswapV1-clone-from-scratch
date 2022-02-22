import { useContext, useState, useEffect } from 'react'
import CurrencyListModal from '../components/CurrencyListModal'
import InputField from '../components/Swap/InputField'
import { TransactionContext } from '../context/TransactionContext'

const styles = {
  wrapper: `flex flex-col space-y-8`,
  container: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  header: `px-2 flex items-center justify-center font-medium text-xl pb-2 border-b border-gray-800`,
  fieldTitle: `mt-6 text-sm tracking-wide`,
  liquidityContainer: `flex justify-between`,
  reserves: `flex flex-col items-end mr-4`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const TRADE_SIDE = { in: 'in', out: 'out' }

const LiquidityPool = () => {
  const { tokenPair, setTokenPair } = useContext(TransactionContext)
  const [fieldValueIn, setFieldValueIn] = useState()
  const [fieldValueOut, setFieldValueOut] = useState()

  const handleSubmit = (e) => {}
  useEffect(() => {
    setTokenPair({ in: '', out: '' })
  }, [])
  return (
    <div className={styles.wrapper}>
      <CurrencyListModal />
      <div className={styles.container}>
        <div className={styles.header}>Add Liquidity</div>
        <div>
          <div className={styles.fieldTitle}>Deposit Amount</div>
          <InputField
            selectedToken={tokenPair.in}
            tradeSide={TRADE_SIDE.in}
            setFieldValue={setFieldValueIn}
          />
          <InputField
            selectedToken={tokenPair.out}
            tradeSide={TRADE_SIDE.out}
            setFieldValue={setFieldValueOut}
          />
          <div className={styles.liquidityContainer}>
            <div className={styles.fieldTitle}>Pool Liquidity</div>
            <div className={styles.reserves}>
              <div>12122121 Token1</div>
              <div>4349 Token2</div>
            </div>
          </div>
          <div
            className={styles.confirmButton}
            onClick={(e) => handleSubmit(e)}
          >
            Confirm
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>Your Liquidity</div>
        <div>
          <div className={styles.fieldTitle}>You have no position</div>
        </div>
      </div>
    </div>
  )
}

export default LiquidityPool
