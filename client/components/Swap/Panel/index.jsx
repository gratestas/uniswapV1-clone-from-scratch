import { RiSettings3Fill } from 'react-icons/ri'

import CurrencyListModal from '../../CurrencyListModal/index.jsx'
import { styles } from './styles'

import SwapForm from '../Form/index.jsx'

const SwapPanel = () => {
  const swap = async () => {
    await SwapToken('tokenAddress1', 'tokenAddress2', 'fieldValue')
  }

  return (
    <div className={styles.swapForm}>
      <CurrencyListModal />
      <div className={styles.formHeader}>
        <div>Swap</div>
        <div>
          <RiSettings3Fill />
        </div>
      </div>
      <SwapForm />
    </div>
  )
}

export default SwapPanel
