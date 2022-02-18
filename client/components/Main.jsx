import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'

import ethLogo from '../assets/eth.png'

const styles = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  form: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transactionInputContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between`,
  transactionInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const Main = () => {
  const handleChange = (e, amount) => {}
  const handleSubmit = (e) => {}
  return (
    <main className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.formHeader}>
          <div>Swap</div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className={styles.transactionInputContainer}>
          <input
            type="text"
            className={styles.transactionInput}
            placeholder="0.0"
            pattern="[0-9]*[.,]?[0-9]*$"
            onChange={(e) => handleChange(e, 'amount')}
          />
          <div className={styles.currencySelector}>
            <div className={styles.currencySelectorContent}>
              <div className={styles.currencySelectorIcon}>
                <Image src={ethLogo} alt="eth logo" height="30" width="30" />
              </div>
              <div className={styles.currencySelectorTicker}>ETH</div>
              <AiOutlineDown className={styles.currencySelectorArrow} />
            </div>
          </div>
        </div>
        <div className={styles.transactionInputContainer}>
          <input
            type="text"
            className={styles.transactionInput}
            placeholder="0x..."
            onChange={(e) => handleChange(e, 'addressTo')}
          />
          <div className={styles.currencySelector}></div>
        </div>
        <div className={styles.confirButton} onClick={(e) => handleSubmit(e)}>
          Confirm
        </div>
      </div>
    </main>
  )
}

export default Main
