import { useContext } from 'react'
import Image from 'next/image'
import { AiOutlineDown } from 'react-icons/ai'

import { TransactionContext } from '../../context/TransactionContext'
import { styles } from './styles'
import ethLogo from '../../assets/eth.png'

const CurrencySelectButton = ({ selectedToken, tradeSide }) => {
  const { setIsCurrencyListOpen, setTradeSide } = useContext(TransactionContext)

  return (
    <div
      className={styles.currencySelector}
      onClick={() => {
        setIsCurrencyListOpen(true)
        setTradeSide(tradeSide)
      }}
    >
      <div className={styles.currencySelectorContent}>
        <div className={styles.currencySelectorIcon}>
          <Image
            src={selectedToken ? selectedToken.icon : ethLogo}
            alt={selectedToken ? selectedToken.symbol : 'ETH'}
            height="30"
            width="30"
          />
        </div>
        <div className={styles.currencySelectorTicker}>
          {selectedToken ? selectedToken.symbol : 'ETH'}
        </div>
        <AiOutlineDown className={styles.currencySelectorArrow} />
      </div>
    </div>
  )
}

export default CurrencySelectButton
