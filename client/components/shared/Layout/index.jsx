import { useContext } from 'react'
import { TransactionContext } from '../../../context/TransactionContext'
import Header from '../../Header/index.jsx'
import Overlay from '../Overlay'

const styles = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-start`,
  wrapperInner: `w-full h-full h-min-full  flex items-center justify-center mt-18`,
}

const Layout = ({ children }) => {
  const { isCurrencyListOpen } = useContext(TransactionContext)
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.wrapperInner}>{children}</div>
      {isCurrencyListOpen && <Overlay />}
    </div>
  )
}

export default Layout