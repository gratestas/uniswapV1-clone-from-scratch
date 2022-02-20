import Image from 'next/image'
import { AiOutlineDown } from 'react-icons/ai'
import { styles } from './styles'
import ethLogo from '../../assets/eth.png'

const CurrencySelectButton = () => {
  return (
    <div className={styles.currencySelector}>
      <div className={styles.currencySelectorContent}>
        <div className={styles.currencySelectorIcon}>
          <Image src={ethLogo} alt="eth logo" height="30" width="30" />
        </div>
        <div className={styles.currencySelectorTicker}>ETH</div>
        <AiOutlineDown className={styles.currencySelectorArrow} />
      </div>
    </div>
  )
}

export default CurrencySelectButton
