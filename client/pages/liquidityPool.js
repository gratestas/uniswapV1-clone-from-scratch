import InputField from '../components/Swap/InputField'

const styles = {
  wrapper: `flex flex-col space-y-8`,
  container: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  header: `px-2 flex items-center justify-center font-medium text-xl pb-2 border-b border-gray-800`,
  fieldTitle: `mt-6 text-sm tracking-wide`,
  liquidityContainer: `flex justify-between`,
  reserves: `flex flex-col items-end mr-4`,
}

const LiquidityPool = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>Add Liquidity</div>
        <div>
          <div className={styles.fieldTitle}>Deposit Amount</div>
          <InputField />
          <InputField />
          <div className={styles.liquidityContainer}>
            <div className={styles.fieldTitle}>Pool Liquidity</div>
            <div className={styles.reserves}>
              <div>12122121 Token1</div>
              <div>4349 Token2</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>Your Liquidity</div>
        <div>
          <div className={styles.fieldTitle}>You have no position</div>
        </div>
      </div>
    </div>
  )
}

export default LiquidityPool
