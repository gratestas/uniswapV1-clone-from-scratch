import CurrencySelectButton from '../../CurrencySelectButton/index.jsx'
import { TransactionContext } from '../../../context/TransactionContext'
import { useContext } from 'react'
const styles = {
  inputContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  input: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
}

const InputField = ({
  selectedToken,
  tradeSide,
  fieldValue,
  setFieldValue,
}) => {
  const { setTradeSide } = useContext(TransactionContext)
  console.log({ tradeSide })
  const handleChange = (e) => {
    setFieldValue(e.target.value)
    setTradeSide(tradeSide)
  }
  return (
    <div className={styles.inputContainer}>
      <input
        type="number"
        className={styles.input}
        value={fieldValue}
        placeholder="0.0"
        pattern="^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$"
        //onChange={(e) => handleChange(e, 'amount')}
        onChange={(e) => handleChange(e)}
      />
      <CurrencySelectButton
        selectedToken={selectedToken}
        tradeSide={tradeSide}
      />
    </div>
  )
}

export default InputField
