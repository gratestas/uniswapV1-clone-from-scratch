import { RiSettings3Fill } from 'react-icons/ri'

import SwapPanel from '../components/Swap/Panel/index.jsx'
const styles = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
}

const Main = () => {
  return (
    <main className={styles.wrapper}>
      <SwapPanel />
    </main>
  )
}

export default Main
