import { RiSettings3Fill } from 'react-icons/ri'

import CurrencySelectButton from '../../CurrencySelectButton/index.jsx'
import InputField from '../InputField/index.jsx'
import { styles } from './styles'

const SwapPanel = () => {
  const handleSubmit = (e) => {}
  return (
    <div className={styles.swapForm}>
      <div className={styles.formHeader}>
        <div>Swap</div>
        <div>
          <RiSettings3Fill />
        </div>
      </div>
      <InputField />
      <InputField />
      <div className={styles.confirButton} onClick={(e) => handleSubmit(e)}>
        Confirm
      </div>
    </div>
  )
}

export default SwapPanel
