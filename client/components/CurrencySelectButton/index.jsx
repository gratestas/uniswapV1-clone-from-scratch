import { useContext } from 'react'
import Image from 'next/image'
import { AiOutlineDown } from 'react-icons/ai'

import { TransactionContext } from '../../context/TransactionContext'
import { styles } from './styles'
import ethLogo from '../../assets/eth.png'

const CurrencySelectButton = ({
  selectedToken,
  tradeSide,
  disabled = false,
}) => {
  const { setIsCurrencyListOpen, setTradeSide } = useContext(TransactionContext)

  return (
    <div
      className={`${styles.currencySelector} ${disabled && 'w-1/4'}`}
      onClick={() => {
        if (disabled) return
        setIsCurrencyListOpen(true)
        setTradeSide(tradeSide)
      }}
    >
      {selectedToken || disabled ? (
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
          {!disabled && (
            <AiOutlineDown className={styles.currencySelectorArrow} />
          )}
        </div>
      ) : (
        <div className={`${styles.currencySelectorContent} w-[20rem] `}>
          <div className="ml-1 ">Select Token</div>
          <AiOutlineDown className={styles.currencySelectorArrow} />
        </div>
      )}
    </div>
  )
}

export default CurrencySelectButton
