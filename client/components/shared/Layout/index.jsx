import { useContext } from 'react'
import { TransactionContext } from '../../../context/TransactionContext'
import { WalletContext } from '../../../context/WalletContext'
import Header from '../../Header/index.jsx'
import Modal from '../Modal'
import Overlay from '../Overlay'

const styles = {
  wrapper: `min-h-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-start`,
  wrapperInner: `w-full h-full h-min-full  flex items-center justify-center mt-24`,
  confirmButton: `bg-[#2172E5] mt-10 rounded-2xl w-full mb-14 py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

const Layout = ({ children }) => {
  const { isCurrencyListOpen, isActive } = useContext(TransactionContext)
  const { isChainIdCorrect, connectCorrectNetwork}= useContext(WalletContext)
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.wrapperInner}>
        {children}
        </div>
      {!isChainIdCorrect && 
      (<Modal>
        <h1 className='text-2xl mt-16'>Wrong Network</h1>
        <div 
          className={styles.confirmButton}
          onClick={() => connectCorrectNetwork()}
          >
            Switch to Rinkeby
        </div>
      </Modal>
      )}
      {(isCurrencyListOpen || isActive) && <Overlay />}
    </div>
  )
}

export default Layout
