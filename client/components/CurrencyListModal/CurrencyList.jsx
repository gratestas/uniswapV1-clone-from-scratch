import Image from 'next/image'
import { useContext, useState } from 'react'
import tokens from '../../smart_contract/lib/constants/tokens'
import styles from './styles'

import SearchInput from '../shared/SearchInput'
import { TransactionContext } from '../../context/TransactionContext'

const CurrencyList = () => {
  const { tradeSide, setTradeSide, setTokenPair, closePanel } =
    useContext(TransactionContext)
  const [value, setValue] = useState('')

  const selectToken = (token) => {
    if (tradeSide === 'in') {
      setTokenPair((prevState) => ({ ...prevState, in: token }))

      setTradeSide(tradeSide)
    }
    if (tradeSide === 'out') {
      setTokenPair((prevState) => ({ ...prevState, out: token }))
      setTradeSide(tradeSide)
    }
    closePanel()
  }
  return (
    <div>
      <SearchInput value={value} setValue={setValue} />
      <ul className={styles.container}>
        {tokens
          .filter(
            (token) =>
              token.symbol.toLowerCase().includes(value) ||
              token.name.toLowerCase().includes(value)
          )
          .map((token) => (
            <li
              key={token.name}
              className={styles.item}
              onClick={() => selectToken(token)}
            >
              <div className="flex space-x-4">
                <Image
                  src={token.icon}
                  alt={token.symbol}
                  width="50"
                  height="10"
                />
                <div className={styles.content}>
                  <div className={styles.symbol}>{token.symbol}</div>
                  <div className={styles.name}>{token.name}</div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default CurrencyList
