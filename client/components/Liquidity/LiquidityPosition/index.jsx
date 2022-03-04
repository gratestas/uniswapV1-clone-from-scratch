import Image from 'next/image'
import { styles } from './styles'
import ethLogo from '../../../assets/eth.png'
import { formatPrecision } from '../../../smart_contract/lib/utils'

const LuqiudityPosition = ({ token, LPtokens, poolShare }) => {
  return (
    <div className={`${styles.container} mt-10`}>
      <div className={styles.header}>Your Liquidity</div>
      {LPtokens ? (
        <div className={styles.liquidityContainer}>
          <div className={styles.liquidityPosition}>
            <div className={styles.imagesWrapper}>
              <div className={styles.imageContainer}>
                <Image src={token.icon} alt={token.symbol} fill="contain" />
              </div>
              <div className={`absolute left-5 ${styles.imageContainer}`}>
                <Image src={ethLogo} alt="ETH" fill="contain" />
              </div>
            </div>
            <div className={styles.liquidityPair}>{token.symbol}-ETH</div>
            <div className={styles.liquidityValue}>
              {formatPrecision(LPtokens, 5)}
            </div>
            <div className={styles.shareValue}>
              {formatPrecision(poolShare, 3)}%
            </div>
            <div className={styles.shareLabel}>share</div>
          </div>
          <div>
            <button className={styles.removeButton}>Remove</button>
          </div>
        </div>
      ) : (
        <div className={styles.noPositionText}>You have no position yet!</div>
      )}
    </div>
  )
}

export default LuqiudityPosition
