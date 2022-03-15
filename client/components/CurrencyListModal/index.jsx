import { useContext } from 'react'
import { TransactionContext } from '../../context/TransactionContext'
import { AiOutlineClose } from 'react-icons/ai'
import CurrencyList from './CurrencyList'
const styles = {
  container: `absolute h-96 max-h-96 overflow-hidden top-10 inset-x-auto bg-[#191B1F] w-[40rem] rounded-2xl p-4 z-20 border border-[#4e5155] `,
  header: `flex justify-between font-semibold my-2`,
}
const CurrencyListModal = () => {
  const { isCurrencyListOpen, setIsCurrencyListOpen } =
    useContext(TransactionContext)

  return (
    <div>
      {isCurrencyListOpen && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>Select a token </div>
            <div onClick={() => setIsCurrencyListOpen(false)}>
              <AiOutlineClose />
            </div>
          </div>
          <CurrencyList />
        </div>
      )}
    </div>
  )
}

export default CurrencyListModal
