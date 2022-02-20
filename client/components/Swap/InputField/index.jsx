import CurrencySelectButton from '../../CurrencySelectButton/index.jsx'

const styles = {
  transactionInputContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transactionInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
}

const InputField = () => {
  const handleChange = (e, amount) => {}

  return (
    <div className={styles.transactionInputContainer}>
      <input
        type="text"
        className={styles.transactionInput}
        placeholder="0.0"
        pattern="[0-9]*[.,]?[0-9]*$"
        onChange={(e) => handleChange(e, 'amount')}
      />
      <CurrencySelectButton />
    </div>
  )
}

export default InputField
