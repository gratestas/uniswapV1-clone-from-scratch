import Image from 'next/image'
import ethLogo from '../../assets/eth.png'
import { formatPrecision } from '../../smart_contract/lib/utils'
import { styles } from './styles'

const theadItems = ['Pool', 'TVL', 'Volume 24H', 'Volume 7D']

const PoolTable = ({ poolsData }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className="hover:bg-">
            {theadItems.map((item, index) => (
              <th key={index} scope="col" className={styles.thead_item}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {poolsData &&
            poolsData.map((pool) => (
              <tr key={pool.token.name} className={styles.tbody_row}>
                <td scope="col" className={styles.tbody_item}>
                  <div className={styles.tbody_item__inner}>
                    <div className="mr-4 h-8 w-8">
                      <Image
                        src={pool.token.icon}
                        alt={pool.token.symbol}
                        fill="contain"
                      />
                    </div>
                    <div className="absolute left-6 h-8 w-8">
                      <Image src={ethLogo} alt="eth" fill="contain" />
                    </div>
                    <div className="ml-6">{pool.token.symbol}-ETH</div>
                  </div>
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {formatPrecision(pool.liquidity, 3)} ETH
                </td>
                <td scope="col" className={styles.tbody_item}>
                  $--
                </td>
                <td scope="col" className={styles.tbody_item}>
                  $--
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default PoolTable
