import { useContext } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'
import CurrencyListModal from '../../CurrencyListModal/index.jsx'

import { TransactionContext } from '../../../context/TransactionContext'
import InputField from '../InputField/index.jsx'
import { styles } from './styles'

const SwapPanel = () => {
  const { tokenPair } = useContext(TransactionContext)
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
      <InputField selectedToken={tokenPair.in} tradeSide="in" />
      <InputField selectedToken={tokenPair.out} tradeSide="out" />
      <div className={styles.confirmButton} onClick={(e) => handleSubmit(e)}>
        Confirm
      </div>
    </div>
  )
}

export default SwapPanel
