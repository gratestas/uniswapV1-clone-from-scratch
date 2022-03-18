import Link from 'next/link'
import { formatDate } from '../../smart_contract/lib/utils'
import { styles } from './styles'

const theadItems = [
  'Transaction Hash',
  'Type',
  'From',
  'To',
  'Sold',
  'Purchased',
  'Date',
  '',
]

const TransactionsTable = ({ transactions }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className="">
            {theadItems.map((item, index) => (
              <th key={index} scope="col" className={styles.thead_item}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {transactions &&
            transactions.map((tx) => (
              <tr key={tx._id} className={styles.tbody_row}>
                <td scope="col" className={styles.tbody_item}>
                  <div className={styles.tbody_item__inner}>
                    {`${tx.txHash.slice(0, 6)}...${tx.txHash.slice(60)}`}
                  </div>
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {tx.txType}
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {`${tx.fromAddress.slice(0, 6)}...${tx.fromAddress.slice(
                    38
                  )}`}
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {`${tx.toAddress.slice(0, 6)}...${tx.toAddress.slice(38)}`}
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {tx.amountSold}
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {tx.amountPurchased}
                </td>
                <td scope="col" className={styles.tbody_item}>
                  {formatDate(tx.timeStamp)}
                </td>
                <td scope="col" className={styles.tbody_item}>
                  <Link href={`https://rinkeby.etherscan.io/tx/${tx.txHash}`}>
                    <a>View on Etherscan</a>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionsTable
